const db = require("../models");
const User = db.user;

exports.findAll = async (req, res) => {
  const { page = 1, search } = req.query;

  const query = {
    // name: { $regex: new RegExp(search), $options: "i" },
    roles: "doctor",
  };

  const options = {
    page,
    limit: 6,
    collation: {
      locale: "en",
    },
  };

  User.paginate(query, options)
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        results: data.docs.map((doctor) => {
          return {
            id: doctor._id,
            name: doctor.name,
            avatar: doctor.avatar,
            praktik: doctor.praktik,
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

  User.findById(id)
    .where({ roles: "doctor" })
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
