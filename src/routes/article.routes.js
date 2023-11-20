module.exports = (app) => {
  const article = require("../controllers/article.controller.js");
  const router = require("express").Router();

  router.get("/", (req, res) => {
    res.json("This is articles route");
  });

  router.get("/:id", (req, res) => {
    res.json(req.params.id);
  });

  router.post("/", article.create);

  app.use("/api/article", router);
};
