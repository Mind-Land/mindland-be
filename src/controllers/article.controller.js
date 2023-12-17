const db = require("../models");
const Article = db.article;
const slugify = require("slugify");
const { cloudinary } = require("../utils/cloudinary");

exports.create = async (req, res) => {
  // Validasi
  if (
    !req.body.title &&
    !req.body.category &&
    !req.body.content &&
    !req.body.imageUrl &&
    !req.body.summary
  ) {
    res.status(400).send({ message: "Semua field harus terisi!" });
    return;
  }

  if (!req.user.roles === "doctor") {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  try {
    const imageFile = req.body.imageUrl;
    const uploadedResponse = await cloudinary.uploader.upload(imageFile, {
      upload_preset: "mindland",
    });

    req.body.imageUrl = uploadedResponse.url;
  } catch (error) {
    console.log(error);
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
  const { page = 1, title, popular = 0, category } = req.query;

  const query = {
    title: { $regex: new RegExp(title), $options: "i" },
    hit: popular ? { $gte: popular } : { $gte: 0 },
    category: { $regex: new RegExp(category), $options: "i" },
  };

  const options = {
    sort: { createdAt: -1 },
    page,
    populate: {
      path: "author",
      select: "fullName avatar -_id",
    },
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
            category: article.category,
            slug: article.slug,
            timestamp: article.createdAt,
            hit: article.hit,
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
    .populate("author", "fullName avatar job pengalaman -_id")
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

exports.findById = (req, res) => {
  const id = req.params.id;

  Article.findById(id)
    .populate("author", "fullName avatar -_id")
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
  if (!req.user.id) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

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

  if (!id) {
    return res.status(400).send({
      message: "Id tidak boleh kosong!",
    });
  }

  if (!req.user.id) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

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

exports.findArticleByUser = (req, res) => {
  const id = req.params.id;

  if (!req.user.id === id) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  Article.find({ author: id })
    .populate("author", "fullName avatar -_id")
    .then((data) => {
      // console.log(data);
      if (!data)
        res
          .status(404)
          .send({ message: `Artikel dengan userID ${id} tidak ditemukan!` });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Terjadi kesalahan saat mengambil artikel dengan userID${id}!`,
      });
    });
};
