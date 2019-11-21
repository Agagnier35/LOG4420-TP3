const express = require("express");
const router = express.Router();
const moment = require("moment");
const fetch = require("node-fetch");
const url = "http://localhost:3000/api/publications";

async function getPublications(req, res, next) {
  const fetchOpts = {
    method: "GET",
    headers: { Cookie: `ulang=${req.app.locals.lang}` }
  };

  const { limit, page, sort_by, order_by } = req.query;
  const pagingOptions = {
    limit: limit || 10,
    pageNumber: page || 1,
    sort_by,
    order_by
  };

  const publications = await fetch(
    `${url}?limit=${pagingOptions.limit}&page=${pagingOptions.pageNumber}&sort_by=${pagingOptions.sort_by}&order_by=${pagingOptions.order_by}`,
    fetchOpts
  )
    .then(response => response.json())
    .catch(err => next(err));
  const { number } = await fetch(`${url}/count`).then(response =>
    response.json()
  );
  const numberOfPages = Math.ceil(number / pagingOptions.limit);
  const monthNames = moment.localeData(req.app.locals.lang).months();
  const pubFormErrors = req.pubFormErrors || [];
  const data = {
    publications,
    numberOfPages,
    monthNames,
    pagingOptions,
    pubFormErrors
  };

  res.render("./../views/publication", data, (err, body) => {
    err ? next(err) : res.send(body);
  });
}

async function addPublication(req, res, next) {
  const fetchOpts = {
    method: "POST",
    headers: {
      Cookie: `ulang=${req.app.locals.lang}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  };

  const data = await fetch(url, fetchOpts)
    .then(response => response.json())
    .catch(err => next(err));

  req.pubFormErrors = data && data.errors;
  next();
}

async function removePublication(req, res, next) {
  const fetchOpts = {
    method: "DELETE",
    headers: {
      Cookie: `ulang=${req.app.locals.lang}`
    }
  };

  const data = await fetch(`${url}/${req.params.id}`, fetchOpts)
    .then(response => response.json())
    .catch(err => next(err));

  req.pubFormErrors = data && data.errors;
  next();
}
router.get("/", getPublications);
router.post("/", addPublication, getPublications);
router.post("/:id", removePublication, getPublications);
module.exports = router;
