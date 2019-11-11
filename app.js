const express = require('express')
const app = express()

const path = require('path')
const createError = require('http-errors')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const moment = require('moment')
const i18n = require('i18n-express')
const directory = require('serve-index')

const formatter = require('./helpers/formatter')

const config = require('./config.json')
const MongoClient = require('mongodb').MongoClient

// Possibilité de spécifier le numéro de port par ligne de commande.
const port = process.env.PORT || 3000

// Initialisation de l'engin de la vue Pug
app.set('views', path.join(__dirname, '/views'))
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')

// Initialisation des fichiers statiques
app.use(express.static(path.join(__dirname, '/public')))

// Initialisation du bodyParser pour être capable de récupérer le contenu JSON
// d'un corpus de requête HTTP.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Initialisation de express-session pour être capable de l'utiliser
app.use(cookieParser())
app.use(session({
  secret: 'log4420',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// Initialisation de l'internationalisation
app.use(i18n({
  translationsPath: path.join(__dirname, 'locales'),
  browserEnable: false,
  defaultLang: 'fr',
  siteLangs: ['fr', 'en'],
  cookieLangName: 'ulang',
  textsVarName: 't'
}))

// Initialisation de la langue de momentjs
moment.locale(['fr', 'en'])
app.locals.formatter = formatter

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// Fichier de définitions des routes de l'applications
app.use(require('./routes'))
app.use('/api', require('./routes/rest'))

// Si l'URL n'a pas pu être traité par les middlewares précédents, on envoie
// une page d'erreur 404.
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// Amorçage de l'application web avec la base de données
// À COMPLÉTER
app.listen(port, function () {
  console.log('Listening on port ' + port)
})

module.exports = app
