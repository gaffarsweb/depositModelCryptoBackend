const Wallet = require('../models/Wallet');
const Balance = require('../models/Balance');
const Ledger = require('../models/Ledger');
const Network = require('../models/Network');
const Token = require('../models/Token');

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({
    userId: req.user.id,
    type: 'BUFFER'
  }).select('address chain');

  res.json(wallet);
};

exports.getBalance = async (req, res) => {
  const balances = await Balance.find({ userId: req.user.id });
  res.json(balances);
};

exports.requestWithdraw = async (req, res) => {
  const { amount, toAddress } = req.body;

  const balance = await Balance.findOne({ userId: req.user.id, asset: 'USDT' });
  if (balance.balance < amount)
    return res.status(400).json({ message: 'Insufficient balance' });

  balance.balance -= amount;
  balance.locked += amount;
  await balance.save();

  const ledger = await Ledger.create({
    userId: req.user.id,
    type: 'WITHDRAW',
    asset: 'USDT',
    amount,
    status: 'PENDING',
    toAddress
  });

  res.json({ message: 'Withdrawal requested', ledgerId: ledger._id });
};

exports.getTransactions = async (req, res) => {
  const txs = await Ledger.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(txs);
};


exports.getNetworks = async (req, res) => {
  const networks = await Network.find({ isEnabled: true });
  res.json(networks);
};

exports.getTokensByNetwork = async (req, res) => {
  const tokens = await Token.find({
    networkId: req.params.networkId,
    isEnabled: true
  });
  res.json(tokens);
};