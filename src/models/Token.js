const mongoose = require('mongoose')


const TokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  decimals: Number,
  address: String,     // null for native tokens
  networkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Network'
  },
  isNative: Boolean,
  isEnabled: { type: Boolean, default: true },
  minDepositAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Token', TokenSchema);
