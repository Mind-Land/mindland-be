require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOption = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
};

const db = require("./src/models");
// const { checkUser } = require("./src/middleware/authMiddleware");
const Role = db.role;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the database!");
    init();
  })
  .catch((err) => {
    console.log("Failed when connecting to the database!", err);
    process.exit();
  });

function init() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        role: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Role user telah berhasil dibuat!");
      });

      new Role({
        role: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Role admin telah berhasil dibuat!");
      });

      new Role({
        role: "doctor",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Role doctor telah berhasil dibuat!");
      });
    }
  });
}

// app.get("/api/*", checkUser);
require("./src/routes/index.routes")(app);
require("./src/routes/article.routes")(app);
require("./src/routes/auth.routes")(app);

app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
});
