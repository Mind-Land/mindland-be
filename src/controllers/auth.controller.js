const db = require("../models");
const User = db.user;
const errorHandler = require("../helpers/errorHandler");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  try {
    const user = await User.register(username, email, password);

    const token = createToken(user.id);

    res
      .status(200)
      .json({ email: user.email, username: user.username, token: token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { user: identifier, password } = req.body;

  console.log(identifier, password);

  try {
    const user = await User.login(identifier, password);
    const token = createToken(user.id);

    res
      .status(200)
      .json({ email: user.email, username: user.username, token: token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  if (!req.cookies.jwt) {
    res.status(401).json({ message: "Unauthorized Access" });
    return;
  }

  res.clearCookie("jwt");
  res.status(200).json({ message: "Berhasil logout!" });
};
