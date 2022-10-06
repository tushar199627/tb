const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema(
  {
    changeCoins: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coins", coinSchema);
