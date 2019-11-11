const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
// const assert = chai.assert
const expect = chai.expect

const teamServiceFactory = require('../../services/mongo/team.js')

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
  describe('Team mongo service', () => {
    it('should load members from mongo db', done => {

      const teamService = teamServiceFactory(db)

      teamService.getTeamMembers((err, members) => {
        expect(err).to.equal(null)

        firstnames = members.map(m => m.firstname)
        expectedFirst3Names = [ 'Patrick', 'Alphonsine', 'Rosamonde' ]
        expectedLast3Names = [ 'Fleurilius', 'Xavier', 'Hildège' ]
        expect(members.length).to.eql(21)
        expect(firstnames.slice(0, 3)).to.eql(expectedFirst3Names)
        expect(firstnames.slice(firstnames.length - 3)).to.eql(expectedLast3Names)
        done()
      })
    })
  })
}
