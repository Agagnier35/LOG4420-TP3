const express = require("express");
const { promisify } = require("util");

module.exports = serviceTeam => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const { t } = req.app.locals;
    const getTeamMembersAsync = promisify(serviceTeam.getTeamMembers);
    try {
      const data = await getTeamMembersAsync();

      const members = data.map((m, i) => {
        const { _id, firstname, lastname, titles } = m;
        return { _id: _id || i, firstname, lastname, titles };
      });
      res.statusCode = 200;
      res.json(members);
    } catch (err) {
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["MEMBERS_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  return router;
};
