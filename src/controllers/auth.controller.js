const db = require("../models");
const User = db.user;
const errorHandler = require("../helpers/errorHandler");

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    res.status(400).send({ message: "Semua field harus terisi!" });
    return;
  }

  const user = new User({
    username,
    email,
    password,
  });

  User.create(user)
    .then(() => {
      res.json({ message: "User berhasil dibuat!" });
    })
    .catch((err) => {
      const errors = errorHandler(err);
      res.status(400).send({ errors });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  res.json({ email, password });
};

exports.logout = (req, res) => {
  res.json("Logout");
};
