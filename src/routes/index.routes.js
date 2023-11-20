// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", (req, res) => {
    res.end(
      `Welcome to Mind Land's API! Read the docs at ${process.env.BASE_URL}`
    );
  });

  app.use("/api", router);
};
