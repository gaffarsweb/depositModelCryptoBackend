const mongoose = require('mongoose');

const WebhookSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['ALCHEMY'],
    default: 'ALCHEMY'
  },

  networkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Network',
    required: true,
    index: true
  },

  webhookId: {
    type: String,
    required: true,
    unique: true
  },

  addressCount: {
    type: Number,
    default: 0
  },

  maxAddresses: {
    type: Number,
    default: 100000
  },

  status: {
    type: String,
    enum: ['ACTIVE', 'FULL', 'DISABLED'],
    default: 'ACTIVE'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Webhook', WebhookSchema);
