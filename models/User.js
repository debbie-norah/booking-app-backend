const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  bookings: [String],
});

module.exports = mongoose.model("User", userSchema);
