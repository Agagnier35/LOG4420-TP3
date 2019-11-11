const mocha = require('mocha')
const chai = require('chai')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const utils = require('../../services/utils.js')

describe('utils.getTranslation', () => {
  it('should provide translation for field in given language', () => {
    const field = { 'fr': 'Bonjour', 'en': 'Hello' }
    expect(utils.getTranslation('fr', field)).to.equal('Bonjour')
    expect(utils.getTranslation('en', field)).to.equal('Hello')
  })

  it('should return empty string for undefined field', () => {
    expect(utils.getTranslation('fr', undefined)).to.equal('')
  })

  it('should default in fr language if not existing', () => {
    const field = { 'fr': 'Bonjour', 'en': 'Hello' }
    expect(utils.getTranslation('es', field)).to.equal('Bonjour')
    expect(utils.getTranslation(undefined, field)).to.equal('Bonjour')
  })
})
