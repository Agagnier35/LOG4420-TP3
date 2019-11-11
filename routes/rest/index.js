const express = require('express')
const router = express.Router()

module.exports = (req, res, next) => {
  // À CHANGER LORSQUE VOUS COMMENCEREZ LA PARTIE MONGODB
  // const factory = require('../../services/mongo/factory')(req.app.db)
  const factory = require('../../services/yaml/factory')(require('fs'))

  router.use('/feed', require('./feed')(factory.feed))
  router.use('/members', require('./members')(factory.members))
  router.use('/projects', require('./projects')(factory.projects, factory.publications))
  router.use('/projects', require('./projects')(factory.projects, factory.publications))
  router.use('/publications', require('./publications')(factory.publications))

  return router(req, res, next)
}
