const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  txHash: String,
  type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAW', 'SYSTEM_FEE', 'INTERNAL_TRANSFER']
  },
  asset: String,
  amount: Number,
  status: { type: String, default: 'CONFIRMED' }
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);
