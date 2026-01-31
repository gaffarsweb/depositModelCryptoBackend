const axios = require('axios');
const Network = require('../models/Network');
const Webhook = require('../models/Webhook');

async function createNewAlchemyWebhook(network, address) {
  if (!network) throw new Error('Network not found');
  if (network.type !== 'EVM')
    throw new Error('Alchemy EVM webhook only supports EVM networks');
  if (!network.alchemyNetwork)
    throw new Error('Alchemy network mapping missing');

  // Make sure you have addresses to track
  const addresses = network?.addressesToTrack || [address];
  if (!addresses.length) throw new Error('No addresses provided for ADDRESS_ACTIVITY webhook');

  const payload = {
    network: network.alchemyNetwork,       // e.g., "ETH_GOERLI"
    webhook_type: 'ADDRESS_ACTIVITY',      // must be 'webhook_type'
    webhook_url: 'https://toolstack.fun/', // your webhook endpoint
    addresses: addresses                   // array of addresses
  };

  const res = await axios.post(
    'https://dashboard.alchemy.com/api/create-webhook',
    payload,
    {
      headers: {
        'X-Alchemy-Token': process.env.ALCHEMY_TOKEN, // correct header
        'Content-Type': 'application/json'
      }
    }
  );

  return await Webhook.create({
    provider: 'ALCHEMY',
    networkId: network?._id,
    webhookId: res?.data?.data.id, // Alchemy returns the webhook ID here
  });
}

module.exports = createNewAlchemyWebhook;
