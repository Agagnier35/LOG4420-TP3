const yaml = require('js-yaml')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les projets
 *
 * @callback projectsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de projets
 */

/**
 *  Obtenir les projets.
 *
 *  @param fs - Système de fichier
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {projectsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjects = fs => language => callback => {
  fs.readFile('./data/projects.yml', 'utf8', (err, content) => {
    if (err) {
      callback(err, null)
    } else {
      const yamlContentOpt = yaml.safeLoad(content)
      const projects = ((yamlContentOpt === null) ? [] : yamlContentOpt)
        // .sort((p1, p2) => p1.year < p2.year ? 1 : p1.year > p2.year ? -1 : 0)
        .map(project => {
          const translatedTitle = getTranslation(language, project.title)
          const translatedDescription = getTranslation(language, project.description)
          return {
            ...project,
            title: translatedTitle,
            description: translatedDescription,
            publications: (project.publications === undefined) ? [] : project.publications
          }
        })
      callback(null, projects)
    }
  })
}

/**
 * Fonction de rappel pour récupérer un projet particulier
 *
 * @callback projectCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Un projet particulier
 */

/**
 *  Obtenir un projet selon un identificatn.
 *
 *  @param fs - Système de fichier
 *  @param {Object} translationObj - Objet qui contient l'ensemble des traductions définies
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {int} id - Identificant unique du projet à trouer
 *  @param {projectCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjectById = fs => translationObj => language => id => callback => {
  getProjects(fs)(language)((err, projects) => {
    if (err) {
      callback(err, null)
    } else {
      const projectOpt = projects.find(p => p._id === id)
      if (projectOpt) {
        callback(null, projectOpt)
      } else {
        const errorMsg = translationObj === undefined && translationObj['PROJECTS'] === undefined && translationObj['PROJECTS']['PROJECT_NOT_FOUND_MSG'] === undefined ? `${id} not found` : translationObj['PROJECTS'['PROJECT_NOT_FOUND_MSG']]
        const error = new Error(errorMsg)
        error.name = 'NOT_FOUND'
        callback(error, null)
      }
    }
  })
}

module.exports = fs => {
  return {
    getProjects: getProjects(fs),
    getProjectById: getProjectById(fs)
  }
}
