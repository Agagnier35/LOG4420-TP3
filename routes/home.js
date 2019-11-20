const express = require('express')
const router = express.Router()

const moment = require('moment')
const fetch = require("node-fetch");
const url = "http://localhost:3000/api/feed/"

router.get('/',(req,res,next)=>{
	const headers = { headers: {Cookie: `ulang=${req.app.locals.lang}`} };
	
	fetch(url, headers)
		.then(response => response.json())
		.then(feeds => {
            feeds = feeds.filter(item => item.text != '');
			res.render('./../views/index', { feeds: feeds }, (err, content) => {
                err ? next(err) : res.send(content)
			});
		});

})

module.exports = router
