require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOption = {
  origin: process.env.CORS,
};

const db = require("./src/models");

app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the database!");
  })
  .catch((err) => {
    console.log("Failed when connecting to the database!", err);
    process.exit();
  });

require("./src/routes/index.routes")(app);
require("./src/routes/article.routes")(app);
require("./src/routes/auth.routes")(app);

app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
});
