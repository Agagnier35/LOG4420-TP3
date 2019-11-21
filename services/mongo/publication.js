const moment = require("moment");
const mongodb = require("mongodb");

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
 *  @param db - Base de données Mongo
 *  @param {numPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNumberOfPublications = db => callback => {
  db.collection("publications")
    .find()
    .count((err, data) => {
      if (err) callback(err, null);
      else {
        callback(null, data);
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
 *  @param db - Base de données Mongo
 *  @param pagingOpts - Base de données Mongo
 *  @param {Object} pagingOpts - Options de pagination au format suivant:
 *    {
 *      pageNumber: <Number>,
 *      limit: <Number>,
 *      sort: [ [ <FIELDNAME>, <asc|desc> ], [ <FIELDNAME>, <asc|desc> ], ...]
 *    }
 *  @param {publicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublications = db => pagingOpts => callback => {
  const mySort = pagingOpts.sorting.reduce((curr, s) => {
    curr[s[0]] = s[1] === "asc" ? 1 : -1;
    return curr;
  }, {});

  db.collection("publications")
    .find()
    .sort(mySort)
    .skip((pagingOpts.pageNumber - 1) * pagingOpts.limit)
    .limit(parseInt(pagingOpts.limit))
    .toArray((err, data) => {
      if (err) callback(err, null);
      else {
        const publications = (data === null ? [] : data).map(publication => {
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
        callback(null, publications);
      }
    });
};

/**
 * Fonction de rappel pour obtenir la publication créée.
 *
 * @callback createdPublicationCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Publication créée
 */

/**
 *  Création d'une publication dans la BD.
 *
 *  @param db - Base de données Mongo
 *  @param publication - Publication à ajouter dans la BD
 *  @param {createdPublicationCallback} callback - Fonction de rappel pour obtenir la publication créée
 */
const createPublication = db => publication => callback => {
  db.collection("publications").insertOne(publication, (err, publication) => {
    err ? callback(err, null) : callback(null, publication);
  });
};

/**
 *  Supprimer une publication avec un ID spécifique
 *
 *  @param db - Base de données Mongo
 *  @param id - Identificant à supprimer de la BD
 *  @param callback - Fonction de rappel qui valide la suppression
 */
const removePublication = db => id => callback => {
  db.collection("publications").deleteOne(
    { _id: mongodb.ObjectId(id) },
    (err, publication) => {
      err ? callback(err, null) : callback(null, publication);
    }
  );
};

/**
 * Fonction de rappel pour récupérer les publications d'un projet.
 *
 * @callback projectPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Publications d'un projet
 */

/**
 *  Obtenir l'ensemble des publications d'un projet
 *
 *  @param db - Base de données Mongo
 *  @param {Array} pubIds - Publication ids
 *  @param {projectPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublicationsByIds = db => pubIds => callback => {
  db.collection("publications")
    .find({ _id: { $in: pubIds } })
    .toArray((err, data) => {
      if (err) callback(err, null);
      else {
        callback(null, data.sort((p1, p2) => (p1.year < p2.year ? 1 : -1)));
      }
    });
};

module.exports = db => {
  return {
    getPublications: getPublications(db),
    createPublication: createPublication(db),
    removePublication: removePublication(db),
    getPublicationsByIds: getPublicationsByIds(db),
    getNumberOfPublications: getNumberOfPublications(db)
  };
};
