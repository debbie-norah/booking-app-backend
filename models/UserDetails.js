const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  password: String,
  email: String,
  token: String
});

module.exports = mongoose.model("UserDetails", userSchema);