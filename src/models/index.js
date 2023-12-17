const dbConfig = require("../configs/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("./user.model.js")(mongoose, mongoosePaginate);
db.doctor = require("./doctor.model.js")(mongoose, mongoosePaginate);
db.category = require("./category.model.js")(mongoose);
db.article = require("./article.model.js")(mongoose, mongoosePaginate);

module.exports = db;
