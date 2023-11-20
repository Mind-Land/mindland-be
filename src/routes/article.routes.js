module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", (req, res) => {
    res.json("This is articles route");
  });

  router.get("/:id", (req, res) => {
    res.json(req.params.id);
  });

  router.post("/", (req, res) => {
    res.json(req.body);
  });

  app.use("/api/article", router);
};
