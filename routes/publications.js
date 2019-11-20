const express = require('express')
const router = express.Router()
const moment = require('moment')
const fetch = require('node-fetch')

router.get('/', getPublications);
router.post('/', savePublication, getPublications);

function getPublications (req, res, next) {
	const opts = { 
		methods: 'GET',
		headers: {Cookie: `ulang=${req.app.locals.lang}`}
	};

	fetch('http://localhost:3000/api/publications', opts)
		.then(response => response.json())
		.then(publications => {
			const sortByOptions = { date: 'date', title: 'title' };
			const orderByOptions = { asc: 'asc', desc: 'desc' };

			const limit = req.query && req.query.limit ? req.query.limit : 10;	// limite par page
			const page = req.query && req.query.page ? req.query.page : 1;		// numéro de la page du tableau
			const sortBy = req.query && req.query.sort_by ? req.query.sort_by : sortByOptions.date;
			const orderBy = req.query && req.query.order_by ? req.query.order_by : orderByOptions.desc;
			const pageOpts = {
				limit: limit,
				pageNumber: page,
				orderBy: orderBy,
				sortBy: sortBy
			};

			const objForTemplate = {
				publications: publications,
				pubFormErrors: {},
				pagingOptions: pageOpts,
				numberOfPages: Math.ceil(publications.length / pageOpts.limit),
				monthNames: moment.months()
			};
			console.log(objForTemplate)
			res.render('./../views/publication', objForTemplate, (err, html) => {
				if (err) {
					next(err);
				} else {
					res.send(html);
				}
			});
		});
}

function savePublication (req, res, next) {
	const opts = { 
		methods: 'POST',
		headers: {Cookie: `ulang=${req.app.locals.lang}`}
	};

	fetch('http://localhost:3000/api/publications/', opts)
		.then(response => next());
}

module.exports = router
