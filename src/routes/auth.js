const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/register", (req, res) => {
  res.json("This is register route");
});

router.get("/login", (req, res) => {
  res.json("This is login route");
});

module.exports = router;
