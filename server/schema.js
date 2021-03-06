const mongoose = require('mongoose');

const coinSchema = mongoose.Schema({
  name: String,
  symbol: String,
  maxsupply: String,
  circsupply: String,
  totsupply: String,
  rank: Number,
  price: String,
  volume: String,
  hour: Number,
  day: Number,
  week: Number,
  month: Number,
  cap: String,
  updated: String,
});

module.exports = mongoose.model('CoinModel', coinSchema);