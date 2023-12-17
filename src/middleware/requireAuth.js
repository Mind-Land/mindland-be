const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;
const Doctor = db.doctor;

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Harus login terlebih dahulu!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: id }).select("id roles");

    if (!user) {
      res.status(401).json({ error: "Unauthorized!" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Unauthorized!" });
  }
};

const requireDoctor = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Harus login terlebih dahulu!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Doctor.findOne({ _id: id }).select("id roles");

    if (!user) {
      res.status(401).json({ error: "Unauthorized!" });
    }

    if (!user.roles === "doctor") {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Unauthorized!" });
  }
};

module.exports = { requireAuth, requireDoctor };
