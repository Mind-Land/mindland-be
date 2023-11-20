module.exports = (app) => {
  const article = require("../controllers/article.controller.js");
  const router = require("express").Router();

  router.get("/", article.findAll);

  router.get("/:id", article.findOne);

  router.put("/:id", article.update);

  router.post("/", article.create);

  app.use("/api/article", router);
};
