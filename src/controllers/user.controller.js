const db = require("../models");
const User = db.user;

exports.findById = async (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .select("-password -__v")
    .then((data) => {
      if (!data) res.status(404).send({ message: "Dokter tidak ditemukan!" });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Terjadi kesalahan saat mengambil data dokter!" });
    });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data yang akan diubah tidak boleh kosong!",
    });
  }

  const { id } = req.params;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      console.log(data);
      if (!data) {
        res.status(404).send({
          message: `Tidak dapat mengubah detail doctor dengan id ${id}!`,
        });
      } else {
        res.send({ message: "Detail doctor berhasil diubah!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || `Gagal saat mengubah detail doctor dengan id ${id}!`,
      });
    });
};
