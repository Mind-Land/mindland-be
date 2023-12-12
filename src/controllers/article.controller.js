const db = require("../models");
const Article = db.article;
const slugify = require("slugify");

exports.create = (req, res) => {
  // Validasi
  if (
    !req.body.title &&
    !req.body.category &&
    // !req.body.author &&
    !req.body.content &&
    !req.body.imageUrl &&
    !req.body.isPublished &&
    !req.body.summary
  ) {
    res.status(400).send({ message: "Semua field harus terisi!" });
    return;
  }

  if (req.user.roles !== "doctor" && req.user.roles !== "admin") {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  const article = new Article({
    title: req.body.title,
    slug: slugify(req.body.title, {
      lower: true,
      replacement: "-",
      remove: /[*+~.()'"!:@?,]/g,
    }),
    author: req.user.id,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    body: req.body.content,
    published: req.body.published,
    category: req.body.category,
    hit: Math.floor(Math.random() * 100),
  });

  Article.create(article)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat artikel baru!",
      });
    });
};

exports.findAll = async (req, res) => {
  const { page = 1, title, author } = req.query;

  const query = {
    title: { $regex: new RegExp(title), $options: "i" }, // Case-insensitive regex for title search
    published: true,
    author: { $regex: new RegExp(author), $options: "i" },
  };

  const options = {
    page,
    limit: 6,
    collation: {
      locale: "en",
    },
  };

  Article.paginate(query, options)
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        results: data.docs.map((article) => {
          return {
            id: article._id,
            title: article.title,
            author: article.author,
            imageUrl: article.imageUrl,
            summary: article.summary,
            slug: article.slug,
            timestamp: article.createdAt,
          };
        }),
        totalPages: data.totalPages,
        currentPage: data.page,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil artikel!",
      });
    });
};

exports.findOne = (req, res) => {
  const slug = req.params.slug;

  Article.findOne({ slug: slug })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: `Artikel dengan slug ${slug} tidak ditemukan!` });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Terjadi kesalahan saat mengambil artikel dengan slug ${id}!`,
      });
    });
};

exports.findAllUnlisted = (req, res) => {};

exports.findById = (req, res) => {
  const id = req.params.id;

  console.log(id);

  Article.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: `Artikel dengan id ${slug} tidak ditemukan!` });
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
