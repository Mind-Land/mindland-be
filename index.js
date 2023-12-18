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

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());

const connectDB = async () => {
  try {
    const conn = await db.mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// db.mongoose
//   .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Successfully connected to the database!");
//   })
//   .catch((err) => {
//     console.log("Failed when connecting to the database!", err);
//     process.exit();
//   });

// app.get("/api/*", checkUser);
require("./src/routes/index.routes")(app);
require("./src/routes/article.routes")(app);
require("./src/routes/doctor.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/auth.routes")(app);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Running on port http://localhost:${port}`);
  });
});
