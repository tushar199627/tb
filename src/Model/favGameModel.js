const mongoose = require("mongoose");

const favGameSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      require: true,
      trim: true,
    },
    EmailId: { type: String, unique: true, required: true, trim: true },
    gameId: { type: Number, unique: true, required: true, trim: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("FavGameList", favGameSchema);