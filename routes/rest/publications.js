const express = require("express");
const { promisify } = require("util");

module.exports = servicePublication => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const { t } = req.app.locals;
    const { limit, page, sort_by, order_by } = req.query;
    const sorting = [];

    // Sort_by "date" will never works since publications doesn't have the field date... (month or year could work)
    // but use it anyways since that's what the TP docs says...

    if (Array.isArray(sort_by) && Array.isArray(order_by)) {
      // both are array, but length may differs, use the default value when undefined
      if (sort_by.length > order_by.length) {
        sort_by.forEach((s, i) => {
          sorting.push([s, order_by[i] || "desc"]);
        });
      } else {
        order_by.forEach((o, i) => {
          sorting.push([sort_by[i] || "date", o]);
        });
      }
    } else if (Array.isArray(sort_by)) {
      // sort_by is an array, but order_by is a string
      sort_by.forEach((s, i) => {
        sorting.push([s, i == 0 ? order_by : "desc"]);
      });
    } else if (Array.isArray(order_by)) {
      // order_by is an array, but sort_by is an string
      order_by.forEach((o, i) => {
        sorting.push([i == 0 ? sort_by : "date", o]);
      });
    } else if (sort_by && order_by) {
      // both are strings
      sorting.push([sort_by, order_by]);
    }

    const pagingOpts = {
      pageNumber: page || 1,
      limit: limit || 10,
      sorting
    };

    const getPublicationsAsync = promisify(
      servicePublication.getPublications(pagingOpts)
    );
    try {
      const data = await getPublicationsAsync();
      const publications = data.map(p => {
        const { key, ...rest } = p;
        return { _id: key, ...rest };
      });
      res.statusCode = 200;
      res.json(publications);
    } catch (err) {
      console.err(err);
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["PUBS_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  router.post("/", async (req, res, next) => {
    const { t } = req.app.locals;
    const { body } = req;
    const errors = [];

    if (Object.entries(body).length === 0 && body.constructor === Object) {
      // {}
      errors.push([t["ERRORS"]["PUB_CREATE_ERROR"]]);
    }

    const { title, month, year, authors, venue } = body;
    if (!authors || authors.length === 0) {
      errors.push([t["ERRORS"]["AUTHOR_EMPTY_FORM"]]);
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear <= 0) {
      errors.push([t["ERRORS"]["YEAR_NOT_INT_FORM"]]);
    }

    const parsedMonth = parseInt(month, 10);
    if (isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11) {
      errors.push([t["ERRORS"]["MONTH_ERROR_FORM"]]);
    }

    if (title.length < 5) {
      errors.push([t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"]]);
    }

    if (venue.length < 5) {
      errors.push([t["ERRORS"]["VENUE_AT_LEAST_5_CHAR_FORM"]]);
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.json({ errors });
      return;
    }
    const createPublicationAsync = promisify(
      servicePublication.createPublication(body)
    );
    try {
      await createPublicationAsync();
      res.statusCode = 201;
      res.json({ errors: [] });
    } catch (err) {
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["PUB_CREATE_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  router.delete("/:id", async (req, res, next) => {
    const { t } = req.app.locals;
    const { id } = req.params;
    const removePublicationAsync = promisify(
      servicePublication.removePublication(id)
    );
    try {
      await removePublicationAsync();
      res.statusCode = 200;
      res.json({ errors: [] });
    } catch (err) {
      if (err.name === "NOT_FOUND") {
        res.statusCode = 404;
        const errorsMsg = t["ERRORS"]["PUB_NOT_FOUND_ERROR"];
        const errors = errorsMsg ? [errorsMsg] : err.message;
        res.json({ errors });
        return;
      } else {
        res.statusCode = 500;
        const errorsMsg = t["ERRORS"]["PUB_DELETE_ERROR"];
        const errors = errorsMsg ? [errorsMsg] : err.message;
        res.json({ errors });
        return;
      }
    }
  });

  router.get("/count", async (req, res, next) => {
    const getNumberPublicationsAsync = promisify(
      servicePublication.getNumberOfPublications
    );
    try {
      const data = await getNumberPublicationsAsync();
      res.json({ number: data });
    } catch (err) {
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["PUBS_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  return router;
};
