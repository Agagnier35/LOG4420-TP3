const express = require("express");

const fetchPublications = (servicePublication, publicationsIds) => {
  return new Promise((resolve, reject) => {
    servicePublication.getPublicationsByIds(publicationsIds)((err, data) => {
      if (err) {
        const errorsMsg = t["ERRORS"]["PUB_NOT_FOUND_ERROR"];
        const errorPub = errorsMsg ? [errorsMsg] : err.message;
        reject(errorPub);
      } else {
        resolve(
          data.map(pub => {
            const { key, ...rest } = pub;
            return { _id: key, ...rest };
          })
        );
      }
    });
  });
};

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router();

  router.get("/", (req, res, next) => {
    const { t, lang } = req.app.locals;
    serviceProjects.getProjects(lang)(async (err, data) => {
      if (err) {
        res.statusCode = 500;
        const errorsMsg = t["ERRORS"]["PROJECTS_ERROR"];
        const errors = errorsMsg ? [errorsMsg] : err.message;
        res.json({ errors });
        return;
      }

      const projects = data.map(async p => {
        const {
          publications: publicationsIds,
          thesisUrl,
          description,
          title,
          year,
          ...project
        } = p;

        const publications = await fetchPublications(
          servicePublication,
          publicationsIds
        );
        return {
          project: { ...project, publications: publicationsIds },
          publications
        };
      });

      Promise.all(projects)
        .then(projects => {
          res.statusCode = 200;
          res.json(projects);
        })
        .catch(errors => {
          res.statusCode = 500;
          res.json({ errors });
        });
    });
  });

  router.get("/:id", (req, res, next) => {
    const { t, lang } = req.app.locals;
    const { id } = req.params;

    serviceProjects.getProjectById(t)(lang)(id)(async (err, data) => {
      if (err) {
        if (err.name == "NOT_FOUND") {
          res.statusCode = 404;
          const errorsMsg = t["ERRORS"]["PROJECT_NOT_FOUND_ERROR"];
          const errors = errorsMsg ? [errorsMsg] : err.message;
          res.json({ errors });
          return;
        } else {
          res.statusCode = 500;
          const errorsMsg = t["ERRORS"]["PROJECT_ERROR"];
          const errors = errorsMsg ? [errorsMsg] : err.message;
          res.json({ errors });
          return;
        }
      }

      const {
        publications: publicationsIds,
        thesisUrl,
        description,
        title,
        year,
        ...projectData
      } = data;

      const publications = await fetchPublications(
        servicePublication,
        publicationsIds
      );

      const project = {
        project: { ...projectData, publications: publicationsIds },
        publications
      };

      res.statusCode = 200;
      res.json(project);
    });
  });

  return router;
};
