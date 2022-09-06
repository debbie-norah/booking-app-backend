const express = require("express");
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

app.use("/", require("./routes/base"));
app.use("/api", require("./routes/api"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to database");
  app.listen(port, () => {
    console.log(`Server up and running at port ${port}`);
  });
});
