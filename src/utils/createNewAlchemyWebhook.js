const axios = require('axios');
const Network = require('../models/Network');
const Webhook = require('../models/Webhook');

async function createNewAlchemyWebhook(network) {

  // const network = await Network.findById(networkId);
  if (!network) throw new Error('Network not found');

  if (network.type !== 'EVM')
    throw new Error('Alchemy EVM webhook only supports EVM networks');

  if (!network.alchemyNetwork)
    throw new Error('Alchemy network mapping missing');

  const res = await axios.post(
    'https://dashboard.alchemy.com/api/webhooks',
    {
      network: network?.alchemyNetwork,
      type: 'ADDRESS_ACTIVITY',
      webhook_url: process.env.ALCHEMY_WEBHOOK_URL
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.ALCHEMY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return await Webhook.create({
    provider: 'ALCHEMY',
    networkId,
    webhookId: res.data.id
  });
}

module.exports = createNewAlchemyWebhook;
