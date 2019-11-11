const express = require('express')
const router = express.Router()

module.exports = (req, res, next) => {
  router.use('/', require('./home'))
  router.use('/team', require('./team'))
  router.use('/projects', require('./projects'))
  router.use('/publications', require('./publications'))

  return router(req, res, next)
}
