const mongoose = require("mongoose");
const experienceSchema = mongoose.Schema({
  cityId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  highlights: [String],
  nextAvailable: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  thumbnailSrc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
