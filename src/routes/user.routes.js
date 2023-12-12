module.exports = (app) => {
  const router = require("express").Router();
  const user = require("../controllers/user.controller.js");
  const { requireAdmin, requireAuth } = require("../middleware/requireAuth.js");

  router.get("/", requireAdmin, user.findAll);
  router.get("/:id", user.findById);
  router.put("/:id", requireAuth, user.update);
  router.delete("/:id", requireAdmin, user.delete);

  app.use("/api/user", router);
};
