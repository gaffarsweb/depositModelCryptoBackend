const mongoose = require('mongoose');

const NetworkSchema = new mongoose.Schema({
  name: String,                 // Ethereum, Solana, Tron
  chainKey: String,             // ETH, BSC, SOL, TRON, SUI
  chainId: Number,              // only for EVM
  rpcUrl: String,
  type: {
    type: String,
    enum: ['EVM', 'SOLANA', 'TRON', 'SUI'],
    required: true
  },
  alchemyNetwork: {
    type: String,          // ETH_MAINNET, POLYGON_MAINNET
  },
  isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Network', NetworkSchema);
