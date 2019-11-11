"use strict";

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page de projets': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:3000/projects")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
      .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
      .assert.elementPresent('#projects-link.active', "Le menu de la page de projets est sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")
      .waitForUpdate();

    // Projets en cours

    client.expect.element('main h1:nth-of-type(1)').text.to.contain('Projets en cours')

    client.expect.elements('.projects:nth-of-type(1) li').count.to.equal(8)

    client.expect.element('.projects:nth-of-type(1) li:first-child span').text.to.contains('Zack')
    client.expect.element('.projects:nth-of-type(1) li:first-child a')
      .text.to.contains('Apprentissage machine pour la classification de réponses à des questions ouvertes')
    client.expect.element('.projects:nth-of-type(1) li:first-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(1) li:first-child .meta')
      .text.to.contains('Co-directeur(e)(s): Zinedine Zidane, Bernard Geoffrion')

    client.expect.element('.projects:nth-of-type(1) li:last-child span').text.to.contains('Damien')
    client.expect.element('.projects:nth-of-type(1) li:last-child a')
      .text.to.contains('Extraction de relations de composition au sein de documents archéologiques')
    client.expect.element('.projects:nth-of-type(1) li:last-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(1) li:last-child .meta')
      .text.to.contains('Co-directeur(e)(s): Alphonsine Beauchamnps')

    // Ancien projets

    client.expect.element('main h1:nth-of-type(2)').text.to.contain('Projets passés')

    client.expect.elements('.projects:nth-of-type(2) li').count.to.equal(9)

    client.expect.element('.projects:nth-of-type(2) li:first-child span').text.to.contains('Granella')
    client.expect.element('.projects:nth-of-type(2) li:first-child a')
      .text.to.contains('Extraction de relations sémantiques à partir de descriptions de sites patrimomiaux du Québec')
    client.expect.element('.projects:nth-of-type(2) li:first-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(2) li:first-child .meta')
      .text.to.contains('Co-directeur(e)(s): Alphonsine Beauchamnps')

    client.expect.element('.projects:nth-of-type(2) li:last-child span').text.to.contains('Hildège')
    client.expect.element('.projects:nth-of-type(2) li:last-child a')
      .text.to.contains('Système d\'aide à la décision pour le réseau de distribution')
    client.expect.element('.projects:nth-of-type(2) li:last-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(2) li:last-child .meta')
      .text.to.contains('Co-directeur(e)(s): Rachid Badouri')

    client.click('.projects:nth-of-type(2) li:nth-child(2) a', function(result) {
      this.expect.element('h1')
        .text.to.equal('Évaluation et amélioration de la qualité de DBpedia pour la représentation de la connaissance du domaine')

      this.expect.element('.meta p:nth-child(1)').text.to.contain('Étudiant: Christophe Deniger')
      this.expect.element('.meta p:nth-child(2)').text.to.contain('Directeur(e): Alphonsine Beauchamps')
      this.expect.element('.meta p:nth-child(3)').text.to.contain('Co-directeur(e)(s): Michel Deslauriers')
      this.expect.element('.description > div p').text.to.contain('L’évolution récente du Web sémantique, tant par la quantité')

      this.expect.elements('.publications tr').count.to.equal(4)
      this.expect.elements('.publications tr:nth-child(1)').text.to.contain('2017')
      this.expect.elements('.publications tr:nth-child(1)').text.to.contain('Janvier')
      this.expect.elements('.publications tr:nth-child(4)').text.to.contain('2015')
      this.expect.elements('.publications tr:nth-child(4)').text.to.contain('Novembre')
    })

    client.end()
  }
  // 'Page du projet de Mailloux': function(client) {
  //   client.url("http://localhost:3000/project-maillouxmaster")
  //     .perform(function() {
  //       console.log = consoleLog;
  //     })
  //     .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
  //     .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
  //     .assert.elementPresent('#projects-link.active', "Le menu de la page de projets est sélectionné.")
  //     .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")
  //     .waitForUpdate();
  //   client.end()
  // },
  // 'Page du projet de Bourgoin': function(client) {
  //   client.url("http://localhost:3000/project-nbourgoinmaster")
  //     .perform(function() {
  //       console.log = consoleLog;
  //     })
  //     .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
  //     .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
  //     .assert.elementPresent('#projects-link.active', "Le menu de la page de projets est sélectionné.")
  //     .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")
  //     .waitForUpdate();
  //   client.end()
  // }
};
