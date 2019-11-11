/**
 * Fonction de rappel pour récupérer les membres du laboratoire.
 *
 * @callback teamCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de membres
 */

const getTeamMembers = db => callback => {
  // À COMPLÉTER
  callback(null, [])
}

module.exports = db => {
  return {
    getTeamMembers: getTeamMembers(db)
  }
}
