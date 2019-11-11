const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const pubServiceFactory = require('../../services/yaml/publication.js')

const pubFilepath = './data/publications.yml'

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

describe('Publication service', () => {
  describe('getPublications', () => {
    it('should load publications from yaml content with year/month parsed date', done => {
      const yamlContent = `---
  - key: radoev2018
    date: "2018-06"
    authors: "Nikolay Radoev, Mathieu Tremblay, Amal Zouaq, Michel Gagnon"
    title: "LAMA: a language adaptive method for question answering"
    venue: "Scalable Question Answering over Linked Data Challenge (SQA2018), Heraklion, Greece"
  `
      const fs = fsFactory(pubFilepath)(yamlContent)

      const pubService = pubServiceFactory(fs)

      pubService.getPublications({})((err, pubs) => {
        expect(err).to.equal(null)

        expect(pubs.length).to.equal(1)
        const pub = pubs[0]
        expect(pub.key).to.eql('radoev2018')
        expect(pub.date).to.eql('2018-06')
        done()
      })
    })

    it('should send error if file does not exist', done => {
      const yamlContent = ``
      const fs = fsFactory('unknown path')(yamlContent)

      const pubService = pubServiceFactory(fs)

      pubService.getPublications({})((err, pubs) => {
        expect(err).to.not.equal(null)
        expect(pubs).to.equal(null)
        done()
      })
    })

    it('should load publications from yaml content with year only if month not provided', done => {
      const yamlContent = `---
  - key: radoev2018
    date: "2018"
    authors: "Nikolay Radoev, Mathieu Tremblay, Amal Zouaq, Michel Gagnon"
    title: "LAMA: a language adaptive method for question answering"
    venue: "Scalable Question Answering over Linked Data Challenge (SQA2018), Heraklion, Greece"
  `
      const fs = fsFactory(pubFilepath)(yamlContent)
      const pubService = pubServiceFactory(fs)

      pubService.getPublications({})((err, pubs) => {
        expect(err).to.equal(null)

        expect(pubs.length).to.equal(1)
        const pub = pubs[0]
        expect(pub.key).to.eql('radoev2018')
        expect(pub.date).to.eql('2018')
        done()
      })
    })
  })

  describe('getPublicationsByIds', () => {
    it('should load publications related to given project', done => {
      const yamlContent = `---
- key: radoev2018
  date: "2018-06"
  authors: "Nikolay Radoev, Mathieu Tremblay, Amal Zouaq, Michel Gagnon"
  title: "LAMA: a language adaptive method for question answering"
  venue: "Scalable Question Answering over Linked Data Challenge (SQA2018), Heraklion, Greece"
`
      const fs = fsFactory(pubFilepath)(yamlContent)
      const pubService = pubServiceFactory(fs)

      const project = {
        id: 'radoev2018masters',
        publications: ['radoev2018']
      }

      pubService.getPublicationsByIds(project.publications)((err, pubs) => {
        expect(err).to.equal(null)

        expect(pubs.length).to.equal(1)
        const pub = pubs[0]
        expect(pub.key).to.eql('radoev2018')
        done()
      })
    })

    it('should load empty publications if project does not have publications', done => {
      const yamlContent = `---
- key: radoev2018
  date: "2018-06"
  authors: "Nikolay Radoev, Mathieu Tremblay, Amal Zouaq, Michel Gagnon"
  title: "LAMA: a language adaptive method for question answering"
  venue: "Scalable Question Answering over Linked Data Challenge (SQA2018), Heraklion, Greece"
`
      const fs = fsFactory(pubFilepath)(yamlContent)
      const pubService = pubServiceFactory(fs)

      const project = {
        id: 'radoev2018masters',
        publications: []
      }

      pubService.getPublicationsByIds(project.publications)((err, pubs) => {
        expect(err).to.equal(null)
        expect(pubs.length).to.equal(0)
        done()
      })
    })

    it('should send error if file does not exist', done => {
      const yamlContent = ``
      const fs = fsFactory('unknown path')(yamlContent)

      const pubService = pubServiceFactory(fs)

      pubService.getPublicationsByIds()((err, pubs) => {
        expect(err).to.not.equal(null)
        expect(pubs).to.equal(null)
        done()
      })
    })

    it('should send empty array if file is empty', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('./data/publications.yml')(yamlContent)

      const publicationsService = pubServiceFactory(fs)

      publicationsService.getPublications({})((err, publications) => {
        expect(err).to.equal(null)
        expect(publications).to.eql([])
        done()
      })
    })
  })

  describe('getNumberOfPublications', () => {
    it('should find number of publications', done => {
      const yamlContent = `---
- key: radoev2018
  date: "2018-06"
  authors: "Nikolay Radoev, Mathieu Tremblay, Amal Zouaq, Michel Gagnon"
  title: "LAMA: a language adaptive method for question answering"
  venue: "Scalable Question Answering over Linked Data Challenge (SQA2018), Heraklion, Greece"

- key: newkey

- key: otherkey
`
      const fs = fsFactory(pubFilepath)(yamlContent)
      const pubService = pubServiceFactory(fs)

      pubService.getNumberOfPublications((err, num) => {
        expect(err).to.equal(null)
        expect(num).to.equal(3)
        done()
      })
    })

    it('should return 0 if file is empty', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('./data/publications.yml')(yamlContent)

      const publicationsService = pubServiceFactory(fs)

      publicationsService.getNumberOfPublications((err, num) => {
        expect(err).to.equal(null)
        expect(num).to.eql(0)
        done()
      })
    })
  })
})
