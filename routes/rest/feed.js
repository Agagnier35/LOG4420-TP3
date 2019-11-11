const express = require("express");

module.exports = serviceFeed => {
  const router = express.Router();

  router.get("/", (req, res, next) => {
    const { t, lang } = req.app.locals;

    serviceFeed.getFeeds(undefined)(lang)((err, data) => {
      if (err) {
        res.statusCode = 500;
        const errorsMsg = t["ERRORS"]["FEEDS_ERROR"];
        const errors = errorsMsg ? [errorsMsg] : err.message;
        res.json({ errors });
        return;
      }

      const feeds = data.map((f, i) => {
        return { _id: i, ...f };
      });

      res.statusCode = 200;
      res.json(feeds);
    });
  });

  return router;
};
