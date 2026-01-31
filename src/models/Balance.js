const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token'
  },
  balance: { type: Number, default: 0 },
  locked: { type: Number, default: 0 }
});


module.exports = mongoose.model('Balance', balanceSchema);
