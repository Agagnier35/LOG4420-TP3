const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const newsServiceFactory = require('../../services/yaml/news.js')

const newsFilepath = './data/news.yml'

const fsFactory = filepath => yamlContent => {
  return {
    readFile: (path, enc, callback) => {
      if (path === filepath && enc === 'utf8') {
        callback(null, yamlContent)
      } else {
        callback(new Error('File not found'), null)
      }
    }
  }
}

describe('News service', () => {
  it('should load news from yaml file', done => {
    const yamlContent = `---
- text:
    fr: "Article X a été publié."
  createdAt: "2018-12-22 12:30:00"
`
    const fs = fsFactory(newsFilepath)(yamlContent)

    const newsService = newsServiceFactory(fs)

    newsService.getNews('fr')((err, news) => {
      expect(err).to.equal(null)

      const expectedCreateAtDate = new Date(2018, 11, 22, 12, 30, 0)
      const expectedNews = [
        { text: 'Article X a été publié.', createdAt: expectedCreateAtDate, type: 'news' }
      ]
      expect(news).to.eql(expectedNews)
      done()
    })
  })

  it('should send error if file does not exist', done => {
    const yamlContent = `---
`
    const fs = fsFactory('unknown path')(yamlContent)

    const newsService = newsServiceFactory(fs)

    newsService.getNews('fr')((err, news) => {
      expect(err).to.not.equal(null)
      expect(news).to.equal(null)
      done()
    })
  })

  it('should send empty array if file is empty', done => {
    const yamlContent = `---
`
    const fs = fsFactory('./data/news.yml')(yamlContent)

    const newsService = newsServiceFactory(fs)

    newsService.getNews('fr')((err, news) => {
      expect(err).to.equal(null)
      expect(news).to.eql([])
      done()
    })
  })
})
