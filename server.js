const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

// Middlewares

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret: process.env.SESSION_SECRET}));
app.use("/", require("./routes/base"));
app.use("/api", require("./routes/api"));
app.use("/auth", require("./routes/auth"));
app.use("/auth/welcome",require("./middleware/authentication"));

mongoose.connect("mongodb://127.0.0.1:27017/bookingapp").then(() => {
  console.log("Connected to database");
  app.listen(port, () => {
    console.log(`Server up and running at port ${port}`);
  });
});
