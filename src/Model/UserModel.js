const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
    },
    userId:{
      type:String
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    emailId: { type: String, unique: true, required: true, trim: true },
    phone: { type: Number, unique: true, required: true, trim: true },

    otp: { type: String, required: true },

    password: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
