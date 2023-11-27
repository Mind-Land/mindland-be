const db = require("../models");
const Article = db.article;

exports.create = (req, res) => {
  // Validasi
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.content &&
    !req.body.imageUrl
  ) {
    res.status(400).send({ message: "Semua field harus terisi!" });
    return;
  }

  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    content: req.body.content,
  });

  Article.save(article)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat artikel baru!",
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.search;
  const query = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Article.find(query)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil artikel!",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Article.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: `Artikel dengan id ${id} tidak ditemukan!` });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Terjadi kesalahan saat mengambil artikel dengan id ${id}!`,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data yang akan diubah tidak boleh kosong!",
    });
  }

  const id = req.params.id;

  Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Tidak dapat mengubah artikel dengan id ${id}!`,
        });
      } else {
        res.send({ message: "Artikel berhasil diubah!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Gagal saat mengubah artikel dengan id ${id}!`,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Article.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Tidak dapat menghapus artikel dengan id ${id}!`,
        });
      } else {
        res.send({ message: "Artikel berhasil dihapus!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Gagal saat menghapus artikel dengan id ${id}!`,
      });
    });
};
