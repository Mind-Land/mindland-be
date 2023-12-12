module.exports = (app) => {
  const router = require("express").Router();
  const doctor = require("../controllers/doctor.controller.js");

  router.get("/", doctor.findAll);
  router.get("/:id", doctor.findById);

  app.use("/api/doctor", router);
};
