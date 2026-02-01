const Wallet = require('../models/Wallet');
const Balance = require('../models/Balance');
const Ledger = require('../models/Ledger');


const Network = require('../models/Network');
const Token = require('../models/Token');


exports.handleAlchemyEvm = async (payload) => {
  const activities = payload.event?.activity || [];
  console.log('activies', activities)
  for (const tx of activities) {
    console.log('trans', tx)
    const network = await Network.findOne({
      chainId: Number(tx.chainId),
      type: 'EVM',
      isEnabled: true
    });
    if (!network) continue;

    let token;

    if (!tx.rawContract?.address) {
      // Native coin
      token = await Token.findOne({
        networkId: network._id,
        isNative: true
      });
    } else {
      // ERC20
      token = await Token.findOne({
        networkId: network._id,
        address: tx.rawContract.address.toLowerCase()
      });
    }
    console.log('token', token);
    if (!token) continue;

    const wallet = await Wallet.findOne({
      networkId: network._id,
      address: tx.to
    });
    console.log('wallet', wallet);
    if (!wallet) continue;
    const exists = await Ledger.findOne({ txHash: tx.hash });
    console.log('exists', exists);
    if (exists) continue;

    const amount = Number(tx.value);
    console.log('amount', amount);
    await Balance.updateOne(
      { userId: wallet.userId, tokenId: token._id },
      { $inc: { balance: amount } },
      { upsert: true }
    );

    await Ledger.create({
      userId: wallet.userId,
      networkId: network._id,
      tokenId: token._id,
      txHash: tx.hash,
      type: 'DEPOSIT',
      amount
    });
  }
};


