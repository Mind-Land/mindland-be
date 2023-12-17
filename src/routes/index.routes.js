// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

module.exports = (app) => {
  const router = require("express").Router();
  const fs = require("fs");
  const YAML = require("yaml");
  const swaggerUi = require("swagger-ui-express");

  const file = fs.readFileSync("./src/api/openapi.yaml", "utf8");
  const swaggerDocument = YAML.parse(file);

  router.get("/", (req, res) => {
    res.end(
      `Welcome to Mind Land's API! Read the docs at ${process.env.BASE_URL}/api/api-docs`
    );
  });

  app.use(
    "/api/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );

  app.use("/api", router);
};
