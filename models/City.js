const mongoose = require("mongoose");
const citySchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  country: {
    code: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    currency: {
      code: {
        type: String,
        required: true,
      },
      currencyName: {
        type: String,
        required: true,
      },
    },
    timeZone: {
      type: String,
      required: true,
    },
  },
  thumbnailSrc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("City", citySchema);
