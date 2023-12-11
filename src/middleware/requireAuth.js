const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Harus login terlebih dahulu!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id: id }).select("id roles");
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Unauthorized!" });
  }
};

module.exports = requireAuth;
