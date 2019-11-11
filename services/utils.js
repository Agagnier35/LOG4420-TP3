/**
 *  Obtenir la traduction désirée d'un champ.
 *
 *  On suppose que le champ contient un ensemble de clés qui correspondent à
 *  la langue avec une valeur traduite.
 *
 *  P.ex. { fr: "Bonjour", en: "Hello" }
 *
 *  Si la langue choisit n'est pas disponible, on choisit par défaut la traduction francophone.
 *
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {Object} field - Champ à récupérer la traduction
 *  @return Valeur traduite du champ
 */
exports.getTranslation = (language, field) => {
  if (field === undefined) {
    return ''
  } else if (language in field) {
    return field[language]
  } else {
    return field['fr']
  }
}
