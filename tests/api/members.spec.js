const mocha = require('mocha')
const chai = require('chai')
const sinon = require('sinon')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
const express = require('express')
const request = require('supertest')

const getMembersFactory = require('../../routes/rest/members')

describe('GET /api/members', done => {

  it('should get members', () => {
    const serviceTeam = {
      'getTeamMembers': callback => {
        callback(null, [])
      }
    }
    const teamRouter = getMembersFactory(serviceTeam)

    const app = express()
    app.use('/api/members', teamRouter)

    request(app)
        .get('/api/members')
        .expect('Content-Type', /json/)
        .expect(200, [], done)

    // const req = { app: { locals: { t: {} } } }
  })

  it('should handle errors in fetching data', done => {
    const serviceTeam = {
      'getTeamMembers': callback => {
        callback(new Error('Erreur...'))
      }
    }
    const teamRouter = getMembersFactory(serviceTeam)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'MEMBERS_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/members', teamRouter)

    request(app)
        .get('/api/members')
        .expect('Content-Type', /json/)
        .expect(500, { errors: [ 'Aie... Erreur...' ] }, done)
  })

  it('should send default error message if not defined', done => {
    const serviceTeam = {
      'getTeamMembers': callback => {
        callback(new Error('Erreur...'))
      }
    }
    const teamRouter = getMembersFactory(serviceTeam)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': {} } } }
      next()
    })
    app.use('/api/members', teamRouter)

    request(app)
        .get('/api/members')
        .expect('Content-Type', /json/)
        .expect(500, { errors: [ 'Erreur...' ] }, done)
  })
})
