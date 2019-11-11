const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const seminarServiceFactory = require('../../services/mongo/seminar.js')

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
  describe('Seminar mongo service', () => {
    it('should load seminars wthout specific query from mongo db', done => {

      const seminarService = seminarServiceFactory(db)
      const query = {}

      seminarService.getSeminars(query)('fr')((err, seminars) => {
        expect(err).to.equal(null)

        expect(seminars.length).to.eql(8)
        const aSeminar = seminars[0]
        expect(Object.keys(aSeminar)).to.contain('_id')
        expect(Object.keys(aSeminar)).to.contain('title')
        expect(Object.keys(aSeminar)).to.contain('presentator')
        expect(Object.keys(aSeminar)).to.contain('description')
        expect(Object.keys(aSeminar)).to.contain('type')
        expect(Object.keys(aSeminar)).to.contain('date')
        expect(Object.keys(aSeminar)).to.contain('createdAt')
        expect(Object.keys(aSeminar)).to.contain('location')
        expect(Object.keys(aSeminar).length).to.eql(8)

        done()
      })
    })

    it('should load seminars from date', done => {
      const seminarService = seminarServiceFactory(db)
      const query = { 'from': new Date(2019, 1, 1) }

      seminarService.getSeminars(query)('fr')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars.length).to.eql(4)
        done()
      })
    })

    it('should load seminars sorted by field descending order', done => {
      const seminarService = seminarServiceFactory(db)
      const query = { 'from': new Date(2019, 1, 1), 'sort': { 'field': 'createdAt', 'order': 'DESC' } }

      seminarService.getSeminars(query)('fr')((err, seminars) => {
        expect(err).to.equal(null)

        expect(seminars.length).to.eql(4)
        expect(seminars[0].title).to.eql('')
        expect(seminars[3].title).to.eql('SC-LSTM: Learning Task-Specific Representations in Multi-Task Learning for Sequence Labeling')
        done()
      })
    })

    it('should load seminars sorted by field ascending order', done => {
      const seminarService = seminarServiceFactory(db)
      const query = { 'from': new Date(2019, 1, 1), 'sort': { 'field': 'createdAt', 'order': 'ASC' } }

      seminarService.getSeminars(query)('fr')((err, seminars) => {
        expect(err).to.equal(null)

        expect(seminars.length).to.eql(4)
        expect(seminars[0].title).to.eql('SC-LSTM: Learning Task-Specific Representations in Multi-Task Learning for Sequence Labeling')
        expect(seminars[3].title).to.eql('')
        done()
      })
    })

    it('should load seminars in english', done => {
      const seminarService = seminarServiceFactory(db)
      const query = { 'from': new Date(2019, 1, 1), 'sort': { 'field': 'createdAt', 'order': 'ASC' } }

      seminarService.getSeminars(query)('en')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars[0].title).to.eql('SC-LSTM: Learning Task-Specific Representations in Multi-Task Learning for Sequence Labeling')
        done()
      })
    })
  })
}

