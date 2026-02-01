const Wallet = require('../models/Wallet');
const Balance = require('../models/Balance');
const Ledger = require('../models/Ledger');
const Network = require('../models/Network');
const Token = require('../models/Token');

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

exports.getWallet = async (req, res) => {
 const wallets = await Wallet.find({
      userId: req.user.id,
      type: 'BUFFER'
    }).populate({
      path: 'networkId',       // the field in Wallet schema
      select: 'name'           // we only need the network name
    }).select('address chain type networkId');

    // Format response
    const formatted = wallets.map(w => ({
      _id: w._id,
      address: w.address,
      chain: w.chain,
      type: w.type,
      network: w.networkId?.name || 'Unknown'
    }));

    res.json(formatted);
};

exports.getBalance = async (req, res) => {
  // Find balances for the user and populate tokenId
  const balances = await Balance.find({ userId: req.user.id })
    .populate({
      path: 'tokenId',                // populate token info
      select: 'symbol name' // get symbol, token name, and networkName
    });

  // Format for frontend
  const formatted = balances.map(b => ({
    _id: b._id,
    balance: b.balance,
    token: {
      symbol: b.tokenId?.symbol,
      name: b.tokenId?.name
    },
    network: {
      name: b.tokenId?.name || 'Unknown'
    }
  }));

  res.json(formatted);
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
  const txs = await Ledger.find({ userId: req.user.id })
    .populate({
      path: 'tokenId',       // populate token
      select: 'symbol name' // include network name if stored there
    })
    .sort({ createdAt: -1 });

  const formatted = txs.map(tx => ({
    _id: tx._id,
    type: tx.type,
    amount: tx.amount,
    status: tx.status,
    createdAt: tx.createdAt,
    token: {
      symbol: tx.tokenId?.symbol,
      name: tx.tokenId?.name
    },
    network: {
      name: tx.tokenId?.name || 'Unknown'
    }
  }));

  res.json(formatted);
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