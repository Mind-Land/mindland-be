module.exports = (app) => {
  const router = require("express").Router();
  const user = require("../controllers/user.controller.js");
  const {
    requireAuth,
    requireDoctor,
  } = require("../middleware/requireAuth.js");

  // router.get("/", requireDoctor, user.findAll);
  router.get("/:id", user.findById);
  router.put("/:id", requireAuth, user.update);
  // router.delete("/:id", requireDoctor, user.delete);

  app.use("/api/user", router);
};
