"use strict";

const assert = require("assert");
const { expect } = require('chai')
const { setValue } = require('./utils')

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page de publications': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:3000/publications")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
      .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementPresent('#publications-link.active', "Le menu de la page de publications est sélectionné.")

    client.expect.element('.modal').to.not.be.visible
    client
      .click('button.trigger', () => {
        client.expect.element('.modal').to.be.visible
        client.elements('css selector', '.author-input', result => {
          assert(result.value.length === 1, "Le nombre de champ d'auteur n'est pas égal à 1.")
        })
        client.click('.add-author i', result => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 2, "Le nombre de champ d'auteur n'est pas égal à 2.")
          })
        })
        client.click('.add-author i', () => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 3, "Le nombre de champ d'auteur n'est pas égal à 3.")
          })
        })
        client.click('.remove-author:nth-child(14) i', () => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 2, "Le nombre de champ d'auteur n'est pas égal à 2.")
          })
        })
      })
      .click('.modal .close-button', () => {
        client.expect.element('.modal').to.not.be.visible
      })

    client.expect.elements('.publications tr').count.to.equal(10)
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('date')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('desc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2019')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Janvier')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Mining Concept Map from Text in Portuguese')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Camila Zacche de Aguiar, Davidson Cury, Alphonsine Beauchamps')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Brazilian Journal of Computers in Education 27.01')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Automatic Extraction of Axioms from Wikipedia Using SPARQL')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Joey Gelinas, Alphonsine Beauchamps, Michel Deslauriers')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('ESWC-16 Open Knowledge Extraction Challenge, Heraklion, Greece')

    // Changement de l'ordre du filtre
    client
      .execute(setValue, ['#filterAscValueSection', 'asc'], result => {
        client.pause(250).assert.urlContains('order_by=asc')
      })
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2011')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2012')

    // Changement du type de filtre
    client.execute(setValue, ['#filterAscValueSection', 'desc'], result => {
      client.pause(250).assert.urlContains('order_by=desc')
    })
    client.setValue('#fieldFilterSection', 'title', result => {
      client.pause(250).assert.urlContains('sort_by=title')
    })
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2012')

    client.execute(setValue, ['#filterAscValueSection', 'asc'], result => {
      client.pause(500).assert.urlContains('order_by=asc')
    })
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2018')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Michelle')

    // Affichage de la page courante dans la pagination
    client.expect.elements('.pagination .pagination-link').count.to.equal(6)
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(1)', "La fonction page précédente de la pagination est active.")
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(2)', "La 1re page de la pagination est active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(3)', "La 2re page de la paginationn n'est pas active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(4)', "La 3re page de la pagination n'est pas active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(5)', "La fonction prochaine page de la pagination n'est pas active.")
    client
      .click('.pagination .pagination-link:nth-child(4)', function() {
        this.pause(250).assert.urlContains('page=3')
      })
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(1)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(2)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(3)')
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(4)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(5)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(6)')
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2011')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Michel')

    client
      .click('.pagination .pagination-link:nth-child(6)', function() {
        this.pause(250).assert.urlContains('page=4')
      })
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2012')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')

    client
      .click('.pagination .pagination-link:nth-child(6)', function() {
        this.pause(250).assert.urlContains('page=4')
      })

    // Changement du nombre d'éléments par page
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('10')
    client
      .execute(setValue, ['#elementsPerPageSection', '30'], result => {
        client.pause(250).assert.urlContains('limit=30').assert.urlContains('page=1')
      })
    client.expect.elements('.publications tr').count.to.equal(30)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2018')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(30)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(30)').text.to.contains('Michel')

    client
      .click('.pagination .pagination-link:nth-child(3)', function() {
        this.pause(250).assert.urlContains('page=2')
      })
    client.expect.elements('.publications tr').count.to.equal(10)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2012')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')

    // // Suppression de la première publication
    // client
    //   .click('.pagination .pagination-link:nth-child(2)', function() {
    //     this.pause(500).assert.urlContains('page=1')
    //   })
    // client.expect.element('.publications tr:first-child .pubtitle').text.to.equal('A Comparison of Features for the Automatic Labeling of Student Answers to Open-Ended Questions')
    // client.click('.publications tr:first-child .del-icon i', result => {
    //   client.expect.element('.publications tr:first-child .pubtitle').text.to.equal('A Machine Learning Filter for the Slot Filling Task')
    // })
    // // Suppression de la 3ieme publication
    // client.expect.element('.publications tr:nth-child(3) .pubtitle').text.to.equal('A disambiguation resource extracted from Wikipedia for semantic annotation')
    // client.click('.publications tr:nth-child(3) .del-icon i', result => {
    //   client.expect.element('.publications tr:nth-child(3) .pubtitle').text.to.equal('A knowledge-base oriented approach for automatic keyword extraction')
    // })

    client.setValue('#fieldFilterSection', 'date', result => {})
    client.setValue('#filterAscValueSection', 'asc', result => {})

    client.click('button.trigger')
    client
      .execute(setValue, ['input[name=year]', '1950'], result => { })
      .execute(setValue, ['[name=month]', '1'], result => { })
      .execute(setValue, ['input[name=title]', 'Web sémantique'], result => { })
      .execute(setValue, ['.author-input input', 'Pierre-Marc'], result => { })
      .execute(setValue, ['input[name=venue]', 'WS Conference'], result => { })

    client.submitForm('.modal form')
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('date')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(2)')
    client.expect.elements('.publications tr').count.to.equal(30)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('1950')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Février')

    client.setValue('#filterAscValueSection', 'desc', result => {})
    client.click('.pagination .pagination-link:nth-child(3)')
    client.expect.elements('.publications tr').count.to.equal(11)

    client.click('button.trigger')
    client
      .execute(setValue, ['input[name=year]', '1950'], result => { })
      .execute(setValue, ['[name=month]', '12'], result => { })
      .execute(setValue, ['input[name=title]', 'Web'], result => { })
      .execute(setValue, ['.author-input input', 'Pierre-Marc'], result => { })
      .execute(setValue, ['input[name=venue]', 'WS Conference'], result => { })
    client.submitForm('.modal form')
    client.assert.elementPresent('.errors')
    client.expect.elements('.errors li').count.to.equal(2)

    client.end()
  }
};
