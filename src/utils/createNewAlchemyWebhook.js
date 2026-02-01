const axios = require('axios');
const Network = require('../models/Network');
const Webhook = require('../models/Webhook');

async function createNewAlchemyWebhook(network, address) {
  if (!network) throw new Error('Network not found');
  if (!network.alchemyNetwork)
    throw new Error('Alchemy network mapping missing');

  // Make sure you have addresses to track
  const addresses = network?.addressesToTrack || [address];
  if (!addresses.length) throw new Error('No addresses provided for ADDRESS_ACTIVITY webhook');
  let payload = {
    network: network.alchemyNetwork,       // e.g., "ETH_GOERLI"
    webhook_type: 'ADDRESS_ACTIVITY',      // must be 'webhook_type'
    webhook_url: 'https://toolstack.fun/', // your webhook endpoint
    // array of addresses
  };
  switch (network?.type) {
    case 'EVM': {
      payload.webhook_type = 'ADDRESS_ACTIVITY';
      payload.addresses = addresses;
      payload.webhook_url = 'https://toolstack.fun/';
      break;
    }
    case 'SOLANA': {
      payload = {
        network: network.alchemyNetwork, // SOLANA_MAINNET
        webhook_type: 'ACCOUNT_ACTIVITY',
        webhook_url: 'https://toolstack.fun/',
        accounts: network.addressesToTrack || [address],
      };
      break;
    }
    case 'TRON': {
      break;
    }
    case 'SUI': {
      break;
    }
    default:
      throw new Error('Unsupported network');
  }


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
