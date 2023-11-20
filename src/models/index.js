const dbConfig = requre("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.article = requrie("./article.model.js")(mongoose);

module.exports = db;
