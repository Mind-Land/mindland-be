const db = require("../models");
const User = db.user;
const Doctor = db.doctor;
const errorHandler = require("../helpers/errorHandler");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.register(username, email, password);

    const token = createToken(user.id);

    res.status(200).json({
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      roles: user.roles,
      id: user.id,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { user: identifier, password } = req.body;

  try {
    const user = await User.login(identifier, password);
    const token = createToken(user.id);

    res.status(200).json({
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      roles: user.roles,
      id: user.id,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.doctorRegister = async (req, res) => {
  const { email, password, firstName, lastName, jenisKelamin } = req.body;

  const fullName = `${firstName} ${lastName}`;
  let avatar;

  if (jenisKelamin === "Laki-laki") {
    avatar =
      "https://img.freepik.com/premium-vector/avatar-bearded-doctor-doctor-with-stethoscope-vector-illustrationxa_276184-31.jpg";
  } else {
    avatar =
      "https://img.freepik.com/premium-vector/avatar-female-doctor-with-black-hair-doctor-with-stethoscope-vector-illustrationxa_276184-33.jpg?w=2000";
  }

  try {
    const user = await Doctor.register(
      email,
      password,
      firstName,
      lastName,
      fullName,
      jenisKelamin,
      avatar
    );

    const token = createToken(user.id);

    res.status(200).json({
      email: user.email,
      name: user.fullName,
      avatar: user.avatar,
      roles: user.roles,
      id: user.id,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.login(email, password);
    const token = createToken(doctor.id);

    res.status(200).json({
      email: doctor.email,
      name: doctor.fullName,
      avatar: doctor.avatar,
      id: doctor.id,
      roles: doctor.roles,
      token: token,
    });
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
