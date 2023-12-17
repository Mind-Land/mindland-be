const db = require("../models");
const Doctor = db.doctor;

exports.findAll = async (req, res) => {
  const { page = 1, search } = req.query;

  const query = {
    fullName: { $regex: new RegExp(search), $options: "i" },
  };

  const options = {
    page,
    limit: 6,
    collation: {
      locale: "en",
    },
  };

  // console.log(query);

  Doctor.paginate(query, options)
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        results: data.docs.map((doctor) => {
          return {
            id: doctor._id,
            name: doctor.fullName,
            avatar: doctor.avatar,
            pengalaman: doctor.pengalaman,
            followers: doctor.followers,
            job: doctor.job,
          };
        }),
        totalPages: data.totalPages,
        currentPage: data.page,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil data dokter!",
      });
    });
};

exports.findById = async (req, res) => {
  const id = req.params.id;

  Doctor.findById(id)
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

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data yang akan diubah tidak boleh kosong!",
    });
  }

  const { id } = req.params;

  Doctor.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
