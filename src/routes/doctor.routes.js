const { requireDoctor } = require("../middleware/requireAuth.js");

module.exports = (app) => {
  const router = require("express").Router();
  const doctor = require("../controllers/doctor.controller.js");

  router.get("/", doctor.findAll);
  router.get("/:id", doctor.findById);
  router.put("/:id", requireDoctor, doctor.update);

  app.use("/api/doctor", router);
};
