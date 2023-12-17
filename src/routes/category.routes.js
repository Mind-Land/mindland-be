module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", category.findAll);
  router.post("/", category.create);

  app.use("/api/category", router);
};
