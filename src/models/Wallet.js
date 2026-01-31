const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    networkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Network'
    },
    address: String,
    encryptedPrivateKey: String,
    type: { type: String, enum: ['BUFFER', 'MAIN', 'FEE', 'WITHDRAW'] }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
