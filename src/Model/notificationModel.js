const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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
    textDisplay: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      Description: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
