const express = require("express");
const { promisify } = require("util");

module.exports = serviceFeed => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const { t, lang } = req.app.locals;
    const getFeedsAsync = promisify(serviceFeed.getFeeds(undefined)(lang));

    try {
      const data = await getFeedsAsync();

      const feeds = data.map((f, i) => {
        return { _id: f._id || i, ...f };
      });

      res.statusCode = 200;
      res.json(feeds);
    } catch (err) {
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["FEEDS_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  return router;
};
