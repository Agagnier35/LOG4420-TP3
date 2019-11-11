"use strict"

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page d\'accueil': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:3000")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementPresent('#home-link.active', "Le menu de la page d'accueil est sélectionné.")
      .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")

    client.expect.element('nav li .dropdown .dropdown-content').to.not.be.visible
    client.expect.element('.dropdown-content a:nth-child(1)').to.have.attribute('class').which.contains('active')

    client.expect.element('.jumbotron').text.to.contains('Le laboratoire Semantic IA est un laboratoire de recherche')

    client.expect.elements('.news li').count.to.equal(9)
    client.expect.elements('.news li:nth-child(1) .post-date').text.to.equal('12 décembre 2020')
    client.expect.elements('.news li:nth-child(1) .title').text.to.equal('Prochain séminaire:')
    client.expect.elements('.news li:nth-child(1) .presentator').text.to.equal('')
    client.expect.elements('.news li:nth-child(2) .post-date').text.to.equal('22 décembre 2019')
    client.expect.elements('.news li:nth-child(2) .title').text.to.equal('Prochain séminaire: Déception machine et Hallucinations profondes d\'Érudits: Pourquoi Repère ? Pourquoi maintenant ?')
    client.expect.elements('.news li:nth-child(2) .presentator').text.to.equal('Olivier Spéciel')
    client.expect.elements('.news li:nth-child(2) .date').text.to.equal('jeudi 12 décembre 2019 05:00')
    client.expect.elements('.news li:nth-child(2) .location').text.to.equal('Salle M-1022 au pavillon Lassonde à Polytechnique Montréal')
    client.expect.elements('.news li:nth-child(9) .text .post-date').text.to.equal('12 octobre 2018')
    client.expect.elements('.news li:nth-child(9) .text .title').text.to.equal('')

    client.moveToElement('nav .dropdown', 0, 0)

    client.expect.element('nav .dropdown .dropdown-content').to.be.visible

    client.click('nav .dropdown-content a:nth-child(2)')

    client.expect.element('.dropdown-content a:nth-child(2)').to.have.attribute('class').which.contains('active')

    client.expect.element('.jumbotron').text.to.contains('The Semantic AI Lab is a lab that lorem')

    client.expect.elements('.news li').count.to.equal(9)
    client.expect.elements('.news li:nth-child(1) .post-date').text.to.equal('December 12, 2020')
    client.expect.elements('.news li:nth-child(2) .post-date').text.to.equal('December 22, 2019')
    client.expect.elements('.news li:nth-child(2) .title').text.to.equal('Next seminar: Déception machine et Hallucinations profondes d\'Érudits: Pourquoi Repère ? Pourquoi maintenant ?')
    client.expect.elements('.news li:nth-child(2) .presentator').text.to.equal('Olivier Spéciel')
    client.expect.elements('.news li:nth-child(2) .date').text.to.equal('Thursday, December 12, 2019 5:00 AM')
    client.expect.elements('.news li:nth-child(2) .location').text.to.equal('Salle M-1022 au pavillon Lassonde à Polytechnique Montréal')
    client.expect.elements('.news li:nth-child(9) .post-date').text.to.equal('October 12, 2018')
    client.expect.elements('.news li:nth-child(9) .text .title').text.to.contain('The SAIL Affiliates Program is pleased to welcome Google')

    client.moveToElement('nav .dropdown', 0, 0)
    client.click('nav .dropdown-content a:nth-child(1)')

    client.end()
  }
};
