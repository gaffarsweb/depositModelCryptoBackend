const axios = require('axios');
const Webhook = require('../models/Webhook');
const WebhookAddress = require('../models/WebhookAddress');
const createNewAlchemyWebhook = require('./createNewAlchemyWebhook');
const Network = require('../models/Network');
const MAX_ADDRESSES = 100000;

async function assignAddressToWebhook(networkId, address) {

    // 1️⃣ Find active webhook with available space
    let webhook = await Webhook.findOne({
        networkId,
        provider: 'ALCHEMY',
        status: 'ACTIVE',
        addressCount: { $lt: MAX_ADDRESSES }
    }).sort({ createdAt: 1 });

    const network = await Network.findById(networkId);
    if (!network) {
        throw new Error('Network not found');
    }

    // 2️⃣ If none, create new webhook
    if (!webhook) {
        webhook = await createNewAlchemyWebhook(network);
    }

    // 3️⃣ Add address to Alchemy
    await axios.post(
        `https://dashboard.alchemy.com/api/webhooks/${webhook.webhookId}/addresses`,
        { addresses: [address] },
        {
            headers: {
                Authorization: `Bearer ${process.env.ALCHEMY_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );

    // 4️⃣ Save mapping
    await WebhookAddress.create({
        webhookId: webhook?._id,
        networkId,
        address
    });

    // 5️⃣ Increment count
    webhook.addressCount += 1;

    // 6️⃣ Mark FULL if limit reached
    if (webhook.addressCount >= webhook.maxAddresses) {
        webhook.status = 'FULL';
    }

    await webhook.save();

    return webhook.webhookId;
}

module.exports = { assignAddressToWebhook };
