const mongoose = require('mongoose');

const WebhookAddressSchema = new mongoose.Schema({
  webhookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webhook',
    required: true,
    index: true
  },

  networkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Network',
    required: true
  },

  address: {
    type: String,
    lowercase: true,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

WebhookAddressSchema.index(
  { networkId: 1, address: 1 },
  { unique: true }
);

module.exports = mongoose.model('WebhookAddress', WebhookAddressSchema);
