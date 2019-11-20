const express = require('express')
const router = express.Router()
const fetch = require("node-fetch");
const url = "http://localhost:3000/api/members/"

router.get('/', (req, res, next) => {
    const headers = { headers: { Cookie: `ulang=${req.app.locals.lang}` } };

    fetch(url, headers)
        .then(response => response.json())
        .then(members => {
            res.render('./../views/team', { members: members }, (err, body) => {
                err ? next(err) : res.send(body)
            });
        });

})

module.exports = router
