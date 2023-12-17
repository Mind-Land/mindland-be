const db = require("../models");
const User = db.user;

exports.findById = async (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .select("-password -__v")
    .then((data) => {
      if (!data) res.status(404).send({ message: "User tidak ditemukan!" });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Terjadi kesalahan saat mengambil data user!" });
    });
};

exports.update = async (req, res) => {
  if (!req.body.length > 0) {
    return res.status(400).send({
      message: "Data yang akan diubah tidak boleh kosong!",
    });
  }

  const { id } = req.params;

  if (!req.user.id === id) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Tidak dapat mengubah detail user dengan id ${id}!`,
        });
      } else {
        res.send({ message: "Detail user berhasil diubah!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || `Gagal saat mengubah detail user dengan id ${id}!`,
      });
    });
};
