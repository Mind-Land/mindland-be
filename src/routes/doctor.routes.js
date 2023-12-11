module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", doctor.findAll);

  app.use("/api/doctor", router);
};
