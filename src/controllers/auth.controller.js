const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Wallet: EthersWallet } = require('ethers');

const User = require('../models/User');
const WalletModel = require('../models/Wallet');
const Balance = require('../models/Balance');
const Network = require('../models/Network');
const Token = require('../models/Token');
const { createWallet } = require('../services/walletFactory');
const { assignAddressToWebhook } = require('../utils/alchemyWebhookManager');


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const networks = await Network.find({ isEnabled: true });

  for (const network of networks) {
    const wallet = await createWallet(network);
    if(!wallet) continue;
    if(network?.type === 'EVM') {
     await assignAddressToWebhook(network?._id, wallet?.address);
    }

    await WalletModel.create({
      userId: user?._id,
      networkId: network._id,
      address: wallet.address,
      encryptedPrivateKey: wallet.privateKey,
      type: 'BUFFER'
    });
  }

  const tokens = await Token.find({ isEnabled: true });

  await Balance.insertMany(
    tokens.map(t => ({
      userId: user._id,
      tokenId: t._id,
      balance: 0,
      locked: 0
    }))
  );

  res.json({ message: 'User registered' });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, role: user.role });
};
