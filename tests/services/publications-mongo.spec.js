const mocha = require('mocha')
const chai = require('chai')
const sinon = require('sinon')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const pubServiceFactory = require('../../services/mongo/publication.js')

const config = require('../../config.json')
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(config.dbUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    throw err
  }
  db = client.db(config.dbName)
  executeTestsOnDb(db)
})

function executeTestsOnDb(db) {
  describe('Publications mongo service', () => {
    it('should load publications from mongo db', done => {
      const pubsService = pubServiceFactory(db)

      pubsService.getPublications({ 'limit': 40 })((err, publications) => {
        expect(err).to.equal(null)

        pubTitles = publications.map(p => p.title)
        expect(pubTitles.length).to.eql(40)
        expect(pubTitles).to.contain('Mining Concept Map from Text in Portuguese')
        expect(pubTitles).to.contain('LAMA: a language adaptive method for question answering')

        done()
      })
    })

    it('should limit number of publications to load', done => {
      const pubsService = pubServiceFactory(db)

      pubsService.getPublications({ 'limit': 20 })((err, publications) => {
        expect(err).to.equal(null)

        pubTitles = publications.map(p => p.title)
        expect(pubTitles.length).to.eql(20)

        done()
      })
    })

    it('should sort publications', done => {
      const pubsService = pubServiceFactory(db)

      pubsService.getPublications({ 'limit': 40, 'sorting': ['date', 'asc'] })((err, publications) => {
        expect(err).to.equal(null)

        pubTitles = publications.map(p => p.title)
        expect(pubTitles).to.contain('Answer Set Programming and Blackboard System')
        expect(pubTitles).to.contain('Mining Concept Map from Text in Portuguese')

        done()
      })
    })

    it('should provide paging for publications', done => {
      const pubsService = pubServiceFactory(db)

      pubsService.getPublications({ 'limit': 10, 'sorting': ['date', 'desc'], 'pageNumber': 2 })((err, publications) => {
        expect(err).to.equal(null)

        pubTitles = publications.map(p => p.title)
        expect(pubTitles).to.contain('Étude Prospective d’un Système Tutoriel à l’aide du Modèle des Espaces de Travail Mathématique')
        expect(pubTitles).to.contain('Improving Entity Linking using Surface Form Refinement')

        done()
      })
    })

    it('should get number of publications from db', done => {
      const pubsService = pubServiceFactory(db)
      pubsService.getNumberOfPublications((err, num) => {
        expect(num).to.equal(40)
        done()
      })
    })

    it('should add publication to db', done => {
      const pubsService = pubServiceFactory(db)
      const publication = {
        'title': 'Title test',
        'authors': ['Author1', 'Author2']
      }
      pubsService.createPublication(publication)((err, result) => {
        pubsService.getNumberOfPublications((err, num) => {
          expect(num).to.equal(41)
          done()
        })
      })
    })

    it('should remove publication from db', done => {
      const pubsService = pubServiceFactory(db)

      const options = { 'limit': 10, 'sorting': ['date', 'desc'], 'pageNumber': 2 }
      pubsService.getPublications(options)((err, publications) => {
        pubsService.removePublication(publications[0]._id)((err, result) => {
          expect(err).to.equal(null)
          pubsService.getNumberOfPublications((err, num) => {
            expect(num).to.equal(40)
            done()
          })
        })
      })
    })

    it('should get publications by ids', done => {
      const pubsService = pubServiceFactory(db)

      pubsService.getPublications({ 'limit': 10 })((err, publications) => {
        const ids = [publications[0]._id, publications[1]._id, publications[2]._id]
        pubsService.getPublicationsByIds(ids)((err, pubs) => {
          expect(pubs.length).to.equal(3)
          done()
        })
      })
    })
  })
}
