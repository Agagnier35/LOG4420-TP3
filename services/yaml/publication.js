const yaml = require("js-yaml");
const moment = require("moment");

/**
 * Fonction de rappel pour récupérer le nombre total de publications
 *
 * @callback numPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Number} size - Nombre total de publications
 */

/**
 *  Obtenir le nombre total de publications
 *
 *  @param fs - Système de fichier
 *  @param {numPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNumberOfPublications = fs => callback => {
  fs.readFile("./data/publications.yml", "utf8", (err, content) => {
    if (err) {
      callback(err, null);
    } else {
      const yamlContentOpt = yaml.safeLoad(content);
      const publications = yamlContentOpt === null ? [] : yamlContentOpt;
      callback(null, publications.length);
    }
  });
};

/**
 * Fonction de rappel pour récupérer les publications.
 *
 * @callback publicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de publications
 */

/**
 *  Obtenir toutes les publications.
 *
 *  @param fs - Système de fichier
 *  @param {publicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublications = fs => pagingOpts => callback => {
  fs.readFile("./data/publications.yml", "utf8", (err, content) => {
    if (err) {
      callback(err, null);
    } else {
      const yamlContentOpt = yaml.safeLoad(content);
      const publications = (yamlContentOpt === null ? [] : yamlContentOpt)
        .sort(pagingOpts.sorting ? comparePublications(pagingOpts) : () => {})
        .map(publication => {
          return {
            ...publication,
            month:
              publication.month === undefined
                ? undefined
                : moment()
                    .month(publication.month - 1)
                    .format("MMMM")
          };
        });

      if (
        pagingOpts === undefined ||
        pagingOpts.pageNumber === undefined ||
        pagingOpts.limit === undefined
      ) {
        callback(null, publications);
      } else {
        const startIndex = (pagingOpts.pageNumber - 1) * pagingOpts.limit;
        const endIndex = startIndex + pagingOpts.limit;
        const topNPublications = publications.slice(startIndex, endIndex);
        callback(null, topNPublications);
      }
    }
  });
};

const createPublication = fs => publication => callback => {
  callback();
};

const removePublication = fs => id => callback => {
  callback(null, true);
};

/**
 *  Fonction de comparaison de publications.
 *
 *  @param pagingOpts - Options pour la pagination qui contient entre autre
 *    des options pour le trie
 *  @param p1 - Première publication à comparer
 *  @param p2 - Deuxième publication à comparer
 *  @returns Valeurs de comparaison -1, 1 ou 0
 */
const comparePublications = pagingOpts => (p1, p2) => {
  return pagingOpts.sorting.reduce((acc, sort) => {
    if (acc === 0) {
      const field = sort[0];
      const order = sort[1];
      const compare =
        p1[field] < p2[field] ? -1 : p1[field] > p2[field] ? 1 : 0;
      return order === "asc" ? compare : order === "desc" ? -compare : compare;
    }
    return acc;
  }, 0);
};

/**
 *  Obtenir l'ensemble des publications d'un projet
 *
 *  @param fs - Système de fichier
 *  @param {Object} project - Projet
 *  @param {projectPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublicationsByIds = fs => pubIds => callback => {
  getPublications(fs)({})((err, publications) => {
    if (err) {
      callback(err, null);
    } else {
      callback(
        null,
        publications
          .filter(publication => pubIds.includes(publication.key))
          .sort((p1, p2) => (p1.year < p2.year ? 1 : -1))
      );
    }
  });
};

module.exports = fs => {
  return {
    getPublications: getPublications(fs),
    createPublication: createPublication(fs),
    removePublication: removePublication(fs),
    getPublicationsByIds: getPublicationsByIds(fs),
    getNumberOfPublications: getNumberOfPublications(fs)
  };
};
