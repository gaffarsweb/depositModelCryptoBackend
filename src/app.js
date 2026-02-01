const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);


// const  testSolanaWalletGeneration = async () => {
// const mnemonic = bip39.generateMnemonic();
// const seed = await bip39.mnemonicToSeed(mnemonic); // returns Buffer
// const seed32 = seed.slice(0, 32);                  // take first 32 bytes
// const keypair = Keypair.fromSeed(seed32);

// const privateKey = bs58.default.encode(keypair.secretKey); // base58-encoded
// const address = keypair.publicKey.toBase58();
// console.log('Generated Solana Wallet:', { address, privateKey, mnemonic });
// };
// testSolanaWalletGeneration();
module.exports = app;
