const mocha = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

describe('GET /api/publications', () => {

  it('should get publications', done => {
    const servicePublications = {
      'getPublications': pagingOptions => callback => {
        callback(null, [])
      },
      'getNumberOfPublications': callback => {
        callback(null, 0)
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use('/api/publications', publicationRouter)

    request(app)
      .get('/api/publications')
      .expect('Content-Type', /json/)
      .expect(200, { 'count': 0, 'publications': [] }, done)
  })

  it('should handle errors in fetching data', done => {
    const servicePublications = {
      'getPublications': pagingOptions => callback => {
        callback(new Error('Erreur...'))
      },
      'getNumberOfPublications': callback => {
        callback(null, 0)
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUBS_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .get('/api/publications')
      .expect('Content-Type', /json/)
      .expect(500, { 'errors': [ 'Aie... Erreur...' ] }, done)
  })

  it('should send default error message if not defined', done => {
     const servicePublications = {
      'getPublications': pagingOptions => callback => {
        callback(new Error('Erreur...'))
      },
      'getNumberOfPublications': callback => {
        callback(null, 0)
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': {} } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .get('/api/publications')
      .expect('Content-Type', /json/)
      .expect(500, { 'errors': [ 'Erreur...' ] }, done)
  })
})

describe('POST /api/publications', () => {

  it('should send error if cannot create publication', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(new Error('Erreur...'))
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_CREATE_ERROR': 'Erreur...' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Conférence', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(500, { 'errors': [ 'Erreur...' ] }, done)
  })

  it('should send error if no publication is sent', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'EMPTY_PUBLICATION_FORM': 'Aucune publication envoyée' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Aucune publication envoyée' ] }, done)
  })

  it('should send error if empty publication is sent', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'EMPTY_PUBLICATION_FORM': 'Aucune publication envoyée' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Aucune publication envoyée' ] }, done)
  })

  it('should send error if no author is defined', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'AUTHOR_EMPTY_FORM': 'Aucun auteur' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Aucun auteur' ] }, done)
  })

  it('should send error if no year is defined', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'YEAR_NOT_INT_FORM': 'Année invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 0 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Année invalide' ] }, done)
  })

  it('should send error if year is not an int', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'YEAR_NOT_INT_FORM': 'Année invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 0, 'year': 'ab' })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Année invalide' ] }, done)
  })

  it('should send error if no month is defined', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'MONTH_ERROR_FORM': 'Mois invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'authors': ['Auteur'], 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Mois invalide' ] }, done)
  })

  it('should send error if month is not an int', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'MONTH_ERROR_FORM': 'Mois invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 'ab', 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Mois invalide' ] }, done)
  })

  it('should send error if month is not between 0 and 11', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'MONTH_ERROR_FORM': 'Mois invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 13, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Mois invalide' ] }, done)
  })

  it('should send error if no title is defined', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_AT_LEAST_5_CHAR_FORM': 'Titre invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Titre invalide' ] }, done)
  })

  it('should send error if title has less than 5 characters', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_AT_LEAST_5_CHAR_FORM': 'Titre invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Titr', 'venue': 'Ma conference', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Titre invalide' ] }, done)
  })

  it('should send error if no venue is defined', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'VENUE_AT_LEAST_5_CHAR_FORM': 'Conférence invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Conférence invalide' ] }, done)
  })

  it('should send error if venue has less than 5 characters', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'VENUE_AT_LEAST_5_CHAR_FORM': 'Conférence invalide' } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Conf', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { 'errors': [ 'Conférence invalide' ] }, done)
  })

  it('should send cascading errors if errors in publication creation', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': {
        'PUB_AT_LEAST_5_CHAR_FORM': 'Titre invalide',
        'VENUE_AT_LEAST_5_CHAR_FORM': 'Conférence invalide'
      } } } }
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(400, { errors: ['Titre invalide', 'Conférence invalide'] }, done)
  })

  it('should create publication if body is valid', done => {
    const servicePublications = {
      'createPublication': body => callback => {
        callback(null, { 'insertedId': 10 })
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/api/publications', publicationRouter)

    request(app)
      .post('/api/publications')
      .send({ 'title': 'Mon titre', 'venue': 'Conférence', 'authors': ['Auteur'], 'month': 0, 'year': 2000 })
      .expect('Content-Type', /json/)
      .expect(201, { 'insertedId': 10 }, done)
  })
})

describe('DELETE /api/publications', () => {
  it('should remove publication by id', done => {
    const servicePublications = {
      'removePublication': id => callback => {
        callback(null)
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_DELETE_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .delete('/api/publications/10')
      .expect('Content-Type', /text/)
      .expect(200, 'done', done)
  })

  it('should handle errors in fetching data', done => {
    const servicePublications = {
      'removePublication': id => callback => {
        callback(new Error('Erreur...'))
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_DELETE_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .delete('/api/publications/10')
      .expect('Content-Type', /json/)
      .expect(500, { 'errors': [ 'Aie... Erreur...' ] }, done)
  })

  it('should return 404 if project does not exist', done => {
    const servicePublications = {
      'removePublication': id => callback => {
        const error = new Error('Erreur')
        error.name = 'NOT_FOUND'
        callback(error)
      }
    }

    const publicationRouter = require('../../routes/rest/publications')(servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PUB_DELETE_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/publications', publicationRouter)

    request(app)
      .delete('/api/publications/10')
      .expect('Content-Type', /json/)
      .expect(404, { 'errors': [ 'Aie... Erreur...' ] }, done)
  })
})
