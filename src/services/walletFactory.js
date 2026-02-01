const { Wallet: EvmWallet } = require('ethers');
// later:
// const { Keypair } = require('@solana/web3.js');
// const TronWeb = require('tronweb');
const bip39 = require('bip39');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
async function createWallet(network) {
  switch (network.type) {

    case 'EVM': {
      const wallet = EvmWallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    }

    case 'SOLANA': {
      // Generate mnemonic
      const mnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(mnemonic); // returns Buffer
      const seed32 = seed.slice(0, 32);                  // take first 32 bytes
      const keypair = Keypair.fromSeed(seed32);

      const privateKey = bs58.default.encode(keypair.secretKey); // base58-encoded
      const address = keypair.publicKey.toBase58();

      return {
        address,       // Solana public key
        privateKey,    // Solana private key
        mnemonic       // optional: store mnemonic for recovery
      };
    }

    case 'TRON': {
      return {
        address: 'TRON_ADDRESS',
        privateKey: 'TRON_PRIVATE_KEY'
      };
    }

    case 'SUI': {
      return {
        address: 'SUI_ADDRESS',
        privateKey: 'SUI_PRIVATE_KEY'
      };
    }

    default:
      throw new Error('Unsupported network');
  }
}

module.exports = { createWallet };
