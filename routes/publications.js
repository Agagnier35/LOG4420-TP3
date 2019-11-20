const express = require('express')
const router = express.Router()
const moment = require('moment')
const fetch = require('node-fetch')

router.get('/', getPublications);
router.post('/', addPublication, getPublications);

function getPublications(req, res, next) {
    const fetchOpts = {
        methods: 'GET',
        headers: { Cookie: `ulang=${req.app.locals.lang}` }
    };
    fetch('http://localhost:3000/api/publications', fetchOpts)
        .then(response => response.json())
        .then(publications => {
            const { limit, page, sort_by, order_by } = req.query;

            const pagingOpts = {
                pageNumber: page || 1,
                limit: limit || 10,
                orderBy: order_by || "desc",
                sortBy: sort_by || "date"
            };
        
            const content = {
                publications: publications,
                pubFormErrors: {},
                pagingOptions: pagingOpts,
                numberOfPages: Math.ceil(publications.length / pagingOpts.limit),
                monthNames: moment.months()
            };

            res.render('./../views/publication', content, (err, body) => {
                err ? next(err) : res.send(body);
            });
        });
}

function addPublication(req, res, next) {
    const fetchOpts = {
        methods: 'POST',
        headers: { Cookie: `ulang=${req.app.locals.lang}` }
    };

    fetch('http://localhost:3000/api/publications/', fetchOpts)
        .then(response => next());
}

module.exports = router
