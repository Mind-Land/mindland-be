require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOption = {
  origin: process.env.CORS,
};

// const indexRouter = require("./src/routes/index");
// const usersRouter = require("./src/routes/users");
// const articlesRouter = require("./src/routes/article.routes");
// const authRouter = require("./src/routes/auth");

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require("./src/routes/index.routes")(app);
require("./src/routes/article.routes")(app);

app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
});
