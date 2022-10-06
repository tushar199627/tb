const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
    },
    gameName: {
      type: String,
      required: true,
    },
    gameImage: {
      type: String,
      require: true,
      trim: true,
    },
    gameLink: { type: String, unique: true, required: true, trim: true },
    gameDescription: { type: String, unique: true, required: true, trim: true },

    Coins: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameList", gameSchema);