const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const url = "http://localhost:3000/api/projects/";

router.get("/", (req, res, next) => {
  const headers = { headers: { Cookie: `ulang=${req.app.locals.lang}` } };

  fetch(url, headers)
    .then(response => response.json())
    .then(data => {
      res.render(
        "./../views/projects",
        { projects: data.map(d => d.project) },
        (err, body) => {
          err ? next(err) : res.send(body);
        }
      );
    });
});

router.get("/:id", (req, res, next) => {
  const headers = { headers: { Cookie: `ulang=${req.app.locals.lang}` } };

  fetch("http://localhost:3000/api/projects/" + req.params.id, headers)
    .then(response => response.json())
    .then(data => {
      res.render("./../views/project", data, (err, body) => {
        err ? next(err) : res.send(body);
      });
    });
});

module.exports = router;
