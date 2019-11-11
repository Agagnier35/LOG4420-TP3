"use strict";

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page d\'équipe': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:3000/team")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
      .assert.elementPresent('#team-link.active', "Le menu de la page d'équipe est sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")
      .waitForUpdate();

    client.expect.elements('.people').count.to.equal(4);
    client.expect.elements('.oldpeople section').count.to.equal(2);

    client.expect.element('.people:nth-of-type(1) li:nth-child(1) .name').text.to.contain('Alphonsine')
    client.expect.element('.people:nth-of-type(1) li:nth-child(2) .name').text.to.contain('Michel')

    client.expect.element('.people:nth-of-type(2) li:nth-child(1) .name').text.to.contain('Xavier')

    client.expect.element('.people:nth-of-type(3) li:nth-child(1) .name').text.to.contain('Robert')
    client.expect.element('.people:nth-of-type(3) li:nth-child(2) .name').text.to.contain('Christophe')
    client.expect.element('.people:nth-of-type(3) li:nth-child(3) .name').text.to.contain('Zack')
    client.expect.element('.people:nth-of-type(3) li:nth-child(4) .name').text.to.contain('Clothilde')

    client.expect.element('.people:nth-of-type(4) li:nth-child(1) .name').text.to.contain('Rosamonde')
    client.expect.element('.people:nth-of-type(4) li:nth-child(2) .name').text.to.contain('Aurore')
    client.expect.element('.people:nth-of-type(4) li:nth-child(3) .name').text.to.contain('Capucine')
    client.expect.element('.people:nth-of-type(4) li:nth-child(4) .name').text.to.contain('Damien')
    client.expect.element('.people:nth-of-type(4) li:nth-child(5) .name').text.to.contain('Talbot')
    client.expect.element('.people:nth-of-type(4) li:nth-child(6) .name').text.to.contain('Christophe')

    client.expect.element('.oldpeople section:nth-child(1) li:nth-child(1)').text.to.contain('Xavier')
    client.expect.element('.oldpeople section:nth-child(1) li:nth-child(2)').text.to.contain('Hildège')

    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(1)').text.to.contain('Patrick')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(2)').text.to.contain('Leonard')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(3)').text.to.contain('Joey')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(4)').text.to.contain('Gustina')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(5)').text.to.contain('Granella')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(6)').text.to.contain('Liodore')
    client.expect.element('.oldpeople section:nth-child(2) li:nth-child(7)').text.to.contain('Fleurilius')

    client.end()
  }
};
