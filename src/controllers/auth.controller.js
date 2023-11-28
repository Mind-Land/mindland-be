const db = require("../models");
const User = db.user;
const errorHandler = require("../helpers/errorHandler");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

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
    .then((data) => {
      const token = createToken(data._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
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
