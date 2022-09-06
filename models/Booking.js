const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user: {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  pax: {
    adults: {
      type: Number,
      default: 0,
    },
    children: {
      type: Number,
      default: 0,
    },
    infants: {
      type: Number,
      default: 0,
    },
  },
  details: {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    experienceId: {
      type: String,
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
