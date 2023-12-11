module.exports = (app) => {
  const article = require("../controllers/article.controller.js");
  const router = require("express").Router();
  const requireAuth = require("../middleware/requireAuth.js");

  router.get("/unlisted", requireAuth, article.findAllUnlisted);
  router.get("/", article.findAll);
  router.get("/:slug", article.findOne);
  router.put("/:id", requireAuth, article.update);
  router.delete("/:id", requireAuth, article.delete);
  router.post("/", requireAuth, article.create);

  app.use("/api/article", router);
};
