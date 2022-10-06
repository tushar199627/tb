const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    emailId: { type: String, unique: true, required: true, trim: true },
    phone: { type: Number, unique: true, required: true, trim: true },

    password: { type: String, required: true, trim: true },

    publicAddress: { type: String, trim: true },  

    privateKey: { type: String,  trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
