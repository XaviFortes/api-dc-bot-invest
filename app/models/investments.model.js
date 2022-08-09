const mongoose = require("mongoose");

const Investments = mongoose.model(
  "Investments",
  new mongoose.Schema({
    name: String,
    code: String,
    price: Number,
    prices: [Number],
    buys: Number,
    sells: Number,
  })
);

module.exports = Investments;
