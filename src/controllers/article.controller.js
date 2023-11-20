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

  article
    .save(article)
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
