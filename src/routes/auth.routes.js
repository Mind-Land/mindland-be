module.exports = (app) => {
  const auth = require("../controllers/auth.controller.js");
  const router = require("express").Router();

  router.post("/register", auth.register);
  router.post("/login", auth.login);
  router.get("/logout", auth.logout);

  app.use("/api/auth", router);
};
