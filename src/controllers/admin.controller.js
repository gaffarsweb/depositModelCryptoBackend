const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Balance = require('../models/Balance');
const Ledger = require('../models/Ledger');
const Network = require('../models/Network');
const Token = require('../models/Token');
const Webhook = require('../models/Webhook');

exports.getStats = async (req, res) => {
  const users = await User.countDocuments();
  const pendingWithdraws = await Ledger.countDocuments({ status: 'PENDING' });

  res.json({ users, pendingWithdraws });
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

exports.getAllWallets = async (req, res) => {
  const wallets = await Wallet.find().populate('userId', 'email');
  res.json(wallets);
};

exports.sweepUserFunds = async (req, res) => {
  const { userId } = req.params;

  // DEMO: only ledger update
  await Ledger.create({
    userId,
    type: 'INTERNAL_TRANSFER',
    asset: 'USDT',
    amount: 0,
    status: 'COMPLETED'
  });

  res.json({ message: 'Sweep initiated (demo)' });
};

exports.getWithdrawRequests = async (req, res) => {
  const withdrawals = await Ledger.find({
    type: 'WITHDRAW',
    status: 'PENDING'
  }).populate('userId', 'email');

  res.json(withdrawals);
};

exports.approveWithdraw = async (req, res) => {
  const ledger = await Ledger.findById(req.params.ledgerId);
  if (!ledger) return res.status(404).json({ message: 'Not found' });

  ledger.status = 'COMPLETED';
  await ledger.save();

  await Balance.updateOne(
    { userId: ledger.userId, asset: ledger.asset },
    { $inc: { locked: -ledger.amount } }
  );

  res.json({ message: 'Withdrawal approved' });
};

exports.createNetwork = async (req, res) => {
  const network = await Network.create(req.body);
  res.json(network);
};

exports.getNetworks = async (req, res) => {
  const networks = await Network.find();
  res.json(networks);
};

exports.createToken = async (req, res) => {
  const token = await Token.create(req.body);
  res.json(token);
};

exports.getTokens = async (req, res) => {
  const tokens = await Token.find().populate('networkId');
  res.json(tokens);
};

/**
 * CREATE WEBHOOK (manual or Alchemy auto)
 */
exports.createWebhook = async (req, res) => {
  const { networkId, webhookId } = req.body;

  const network = await Network.findById(networkId);
  if (!network) return res.status(404).json({ message: 'Network not found' });

  const exists = await Webhook.findOne({ webhookId });
  if (exists) return res.status(400).json({ message: 'Webhook already exists' });

  const webhook = await Webhook.create({ networkId, webhookId });
  res.json(webhook);
};

/**
 * LIST WEBHOOKS + ADDRESS COUNT
 */
exports.getWebhooks = async (req, res) => {
  const webhooks = await Webhook.aggregate([
    {
      $lookup: {
        from: 'webhookaddresses',
        localField: 'webhookId',
        foreignField: 'webhookId',
        as: 'addresses'
      }
    },
    {
      $project: {
        webhookId: 1,
        networkId: 1,
        addressCount: { $size: '$addresses' },
        isActive: 1
      }
    }
  ]);

  res.json(webhooks);
};
exports.getNetworksWithTokens = async (req, res) => {
  const networks = await Network.aggregate([
    {
      $lookup: {
        from: 'tokens',
        localField: '_id',
        foreignField: 'networkId',
        as: 'tokens'
      }
    },
    {
      $project: {
        name: 1,
        chainKey: 1,
        chainId: 1,
        rpcUrl: 1,
        type: 1,
        isEnabled: 1,
        tokens: {
          _id: 1,
          symbol: 1,
          address: 1,
          decimals: 1,
          type: 1,
          isEnabled: 1
        }
      }
    }
  ]);

  res.json(networks);
};