const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const newsServiceFactory = require('../../services/mongo/news.js')

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
  describe('News mongo service', () => {
    it('should load news from mongo db in french', done => {

      const newsService = newsServiceFactory(db)

      newsService.getNews('fr')((err, news) => {
        expect(err).to.equal(null)

        expect(news.length).to.eql(5)
        const aNews = news[0]
        expect(Object.keys(aNews)).to.contain('_id')
        expect(Object.keys(aNews)).to.contain('text')
        expect(Object.keys(aNews)).to.contain('type')
        expect(Object.keys(aNews)).to.contain('createdAt')
        expect(Object.keys(aNews).length).to.eql(4)

        expect(aNews.text).to.contain('Le travail de <a href="">Marc Jacques</a> est disponible')

        done()
      })
    })

    it('should load news from mongo db in english', done => {

      const newsService = newsServiceFactory(db)

      newsService.getNews('en')((err, news) => {
        expect(err).to.equal(null)

        expect(news.length).to.eql(5)
        const aNews = news[0]
        expect(Object.keys(aNews)).to.contain('_id')
        expect(Object.keys(aNews)).to.contain('text')
        expect(Object.keys(aNews)).to.contain('type')
        expect(Object.keys(aNews)).to.contain('createdAt')
        expect(Object.keys(aNews).length).to.eql(4)

        expect(aNews.text).to.contain('<a href="">Marc\'s</a> paper is available')

        done()
      })
    })
  })
}
