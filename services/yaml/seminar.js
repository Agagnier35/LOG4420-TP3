const yaml = require('js-yaml')
const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les séminaires
 *
 * @callback seminarCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Séminaires
 */

/**
 *  Obtenir l'ensemble des séminaires.
 *
 *  @param fs - Système de fichier
 *  @param {Object} query - Requête particulière sous le format suivant:
 *    { from: <DATE>, sort: { field: <string>, order: <ASC|DESC> } }
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {seminarCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getSeminars = fs => query => language => callback => {
  fs.readFile('./data/seminars.yml', 'utf8', (err, content) => {
    if (err) {
      callback(err, null)
    } else {
      const yamlContentOpt = yaml.safeLoad(content)
      const seminars = ((yamlContentOpt === null) ? [] : yamlContentOpt)
        .map(s => {
          const translatedTitle = getTranslation(language, s.title)
          const translatedDescription = getTranslation(language, s.description)
          const newDate = moment(s.date, 'YYYY-MM-DD HH:mm:ss').toDate()
          const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
          return {
            ...s,
            title: translatedTitle,
            description: translatedDescription,
            type: 'seminar',
            date: newDate,
            createdAt: newCreatedAtDate
          }
        })

      const transformations = [filterSeminarsByFromDate(query), sortSeminars(query)]
      const transformedSeminars = transformations.reduce((acc, f) => f(acc), seminars)
      callback(null, transformedSeminars)
    }
  })
}

/**
 *  Filtre les séminaires avant une date particulière.
 *
 *  Si la date n'est pas fournise, on renvoie le tableau initial.
 *
 *  @param {Object} query - Objet avec le champ 'query.from'
 *  @param {Array} seminars - Tableau de séminaires à filtrer
 *  @returns {Array} Tableau de séminaires potentiellement filtré
 */
const filterSeminarsByFromDate = query => seminars => {
  if (query !== undefined && query.from !== undefined) {
    return seminars.filter(s => s.date > query.from)
  } else {
    return seminars
  }
}

/**
 *  Trie les séminaires selon un champ et un ordre particulier.
 *
 *  Si le champ et/ou l'ordre n'est pas fournis, on renvoie le tableau initial.
 *
 *  @param {Object} query - Objet avec le champ 'query.sort.field' et 'query.sort.order'
 *  @param {Array} seminars - Tableau de séminaires à filtrer
 *  @returns {Array} Tableau de séminaires potentiellement trié
 */
const sortSeminars = query => seminars => {
  const canSortByField = query !== undefined &&
    query.sort !== undefined &&
    query.sort.field !== undefined &&
    (query.sort.order === 'ASC' || query.sort.order === 'DESC')
  if (canSortByField) {
    return seminars.sort((s1, s2) => compare(query.sort.order)(s1.date)(s2.date))
  } else {
    return seminars
  }
}

/**
 *  Fonction de comparaison entre deux valeurs et un ordre.
 *
 *  @param {string} order - Valeurs ASC ou DESC
 *  @param v1 - Première valeur
 *  @param v2 - Deuxième valeur
 *  @returns {int} Valeur de -1, 0 ou 1 selon le paramètre order
 */
const compare = order => v1 => v2 => {
  if (order === 'ASC') {
    return (v1 < v2) ? -1 : v1 > v2 ? 1 : 0
  } else if (order === 'DESC') {
    return (v1 < v2) ? 1 : v1 > v2 ? -1 : 0
  } else {
    return 0
  }
}

module.exports = fs => {
  return {
    getSeminars: getSeminars(fs)
  }
}
