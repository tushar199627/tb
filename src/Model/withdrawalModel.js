const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    withdrawalId: { type: "string" },

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
    withdrawalAmount: { type: Number, required: true, trim: true },
    withdrawalStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("withdrawal", withdrawalSchema);
