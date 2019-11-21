const express = require('express')
const router = express.Router()
const moment = require('moment')
const fetch = require('node-fetch')
const url = 'http://localhost:3000/api/publications';

function getPublications(req, res, next) {
    const fetchOpts = {
        methods: 'GET',
        headers: { Cookie: `ulang=${req.app.locals.lang}` }
    };
    fetch(url, fetchOpts)
        .then(response => response.json())
        .then(publications => {
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
            } else {
              // both are strings
              sorting.push([sort_by, order_by]);
            }
            const pagingOpts = {
                pageNumber: page || 1,
                limit: limit || 10,
                sort: sorting
            };
 
            const content = {
                publications: publications,
                pubFormErrors: {},
                pagingOptions: pagingOpts,
                numberOfPages: Math.ceil(publications.length / pagingOpts.limit),
                monthNames: moment.months()
            };
            console.log(content)
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

    fetch(url, fetchOpts)
        .then(response => next());
}
router.get('/', getPublications);
router.post('/', addPublication, getPublications);
module.exports = router
