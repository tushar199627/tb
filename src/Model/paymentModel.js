const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: "string" },

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
    depositAmount: { type: Number, required: true, trim: true },
    paymentStatus: { type: String, default: "pending" },
    availableAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
