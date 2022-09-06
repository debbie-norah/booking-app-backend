const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema({
  experienceId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  startingTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  price: {
    adult: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      required: true,
    },
    infants: {
      type: Number,
      required: true,
    },
  },
  unavailableDates: [Date],
  highlights: [String],
  availableTimeSlots: [String],
  ticketsLeft: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Variant", variantSchema);
