const express = require("express");

module.exports = serviceTeam => {
  const router = express.Router();

  router.get("/", (req, res, next) => {
    const { t } = req.app.locals;
    serviceTeam.getTeamMembers((err, data) => {
      if (err) {
        res.statusCode = 500;
        const errorsMsg = t["ERRORS"]["MEMBERS_ERROR"];
        const errors = errorsMsg ? [errorsMsg] : err.message;
        res.json({ errors });
        return;
      }

      const members = data.map((m, i) => {
        // possible use id from mongo? else use index
        const { firstname, lastname, titles } = m;
        return { _id: i, firstname, lastname, titles };
      });
      res.statusCode = 200;
      res.json(members);
    });
  });

  return router;
};
