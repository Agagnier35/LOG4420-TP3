const express = require("express");
const { promisify } = require("util");

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const { t, lang } = req.app.locals;
    const getProjectsAsync = promisify(serviceProjects.getProjects(lang));

    try {
      const data = await getProjectsAsync();
      const projects = data.map(async p => {
        const {
          publications: publicationsIds,
          thesisUrl,
          description,
          title,
          year,
          ...project
        } = p;

        const getPublicationsByIds = promisify(
          servicePublication.getPublicationsByIds(publicationsIds)
        );
        try {
          const publications = await getPublicationsByIds();
          return {
            project: { ...project, publications: publicationsIds },
            publications
          };
        } catch (err2) {
          const errorsMsg = t["ERRORS"]["PUB_NOT_FOUND_ERROR"];
          const errorPub = errorsMsg ? [errorsMsg] : err.message;
          throw new error(errorPub);
        }
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
    } catch (err) {
      res.statusCode = 500;
      const errorsMsg = t["ERRORS"]["PROJECTS_ERROR"];
      const errors = errorsMsg ? [errorsMsg] : err.message;
      res.json({ errors });
    }
  });

  router.get("/:id", async (req, res, next) => {
    const { t, lang } = req.app.locals;
    const { id } = req.params;

    const getProjectByIdAsync = promisify(
      serviceProjects.getProjectById(t)(lang)(id)
    );

    try {
      const data = await getProjectByIdAsync();
      const {
        publications: publicationsIds,
        thesisUrl,
        description,
        title,
        year,
        ...projectData
      } = data;

      const getPublicationsByIds = promisify(
        servicePublication.getPublicationsByIds(publicationsIds)
      );
      try {
        const publications = await getPublicationsByIds();
        const project = {
          project: { ...projectData, publications: publicationsIds },
          publications
        };
        res.statusCode = 200;
        res.json(project);
      } catch (err2) {
        const errorsMsg = t["ERRORS"]["PUB_NOT_FOUND_ERROR"];
        const errorPub = errorsMsg ? [errorsMsg] : err.message;
        throw new error(errorPub);
      }
    } catch (err) {
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
  });

  return router;
};
