const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    discordId: String,
    username: String,
    email: String,
    money: Number,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    investments: [
      {
        code: String,
        amount: Number,
      }
    ]

  })
);

module.exports = User;