const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      images: {
        type: String,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
