const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const seminarsServiceFactory = require('../../services/yaml/seminar.js')

const seminarsFilepath = './data/seminars.yml'

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

describe('Seminars service', () => {
  describe('getSeminars', () => {
    it('should send error if file does not exist', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('unknown path')(yamlContent)

      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({})('fr')((err, seminars) => {
        expect(err).to.not.equal(null)
        expect(seminars).to.equal(null)
        done()
      })
    })

    it('should send empty array if file is empty', done => {
      const yamlContent = `---
  `
      const fs = fsFactory('./data/seminars.yml')(yamlContent)

      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({})('fr')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars).to.eql([])
        done()
      })
    })

    it('without query should load all seminars from yaml file', done => {
      const yamlContent = `---
- title:
    fr: "French title"
  presentator: "Konstantinos Lambrou-Latreille"
  date: "2019-12-12 05:00:00"
  createdAt: "2018-12-12 10:00:00"
  location: "Location"
  description:
    fr: >
      French description
`
      const fs = fsFactory(seminarsFilepath)(yamlContent)

      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({})('fr')((err, seminars) => {
        expect(err).to.equal(null)

        const expectedSeminars = [
          {
            title: 'French title',
            presentator: 'Konstantinos Lambrou-Latreille',
            description: 'French description\n',
            location: 'Location',
            date: new Date(2019, 11, 12, 5, 0, 0),
            createdAt: new Date(2018, 11, 12, 10, 0, 0),
            type: 'seminar'
          }
        ]
        expect(seminars).to.eql(expectedSeminars)
        done()
      })
    })

    it('should filter seminars before specified date using from query', done => {
      const yamlContent = `---
- title:
    fr: "French title"
  presentator: "Konstantinos Lambrou-Latreille"
  date: "2019-12-12 05:00:00"
  createdAt: "2018-12-12 10:00:00"
  location: "Location"
  description:
    fr: >
      French description
`
      const fs = fsFactory(seminarsFilepath)(yamlContent)
      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({ from: new Date(2019, 11, 12, 4, 0, 0) })('fr')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars.length).to.equal(1)
        done()
      })
    })

    it('should sort seminars by date field and ascending order', done => {
      const yamlContent = `---
- id: 2
  date: "2019-12-12 10:00:00"

- id: 1
  date: "2018-12-12 10:00:00"
`
      const fs = fsFactory(seminarsFilepath)(yamlContent)
      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({ sort: { field: 'createdAt', order: 'ASC' } })('fr')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars.map(s => s.id)).to.eql([1, 2])
        done()
      })
    })

    it('should sort seminars by date field and descending order', done => {
      const yamlContent = `---
- id: 1
  date: "2018-12-12 10:00:00"

- id: 2
  date: "2019-12-12 10:00:00"
`
      const fs = fsFactory(seminarsFilepath)(yamlContent)
      const seminarsService = seminarsServiceFactory(fs)

      seminarsService.getSeminars({ sort: { field: 'createdAt', order: 'DESC' } })('fr')((err, seminars) => {
        expect(err).to.equal(null)
        expect(seminars.map(s => s.id)).to.eql([2, 1])
        done()
      })
    })
  })
})
