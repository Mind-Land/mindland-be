module.exports = (app) => {
  const article = require("../controllers/article.controller.js");
  const router = require("express").Router();
  const { requireDoctor } = require("../middleware/requireAuth.js");

  router.get("/unlisted", requireDoctor, article.findAllUnlisted);
  router.get("/", article.findAll);
  router.get("/id/:id", article.findById);
  router.get("/:slug", article.findOne);
  router.put("/:id", requireDoctor, article.update);
  router.delete("/:id", requireDoctor, article.delete);
  router.post("/", requireDoctor, article.create);

  app.use("/api/article", router);
};
