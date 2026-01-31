const { Wallet: EvmWallet } = require('ethers');
// later:
// const { Keypair } = require('@solana/web3.js');
// const TronWeb = require('tronweb');

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
      // placeholder
      return {
        address: 'SOLANA_ADDRESS_PLACEHOLDER',
        privateKey: 'SOLANA_PRIVATE_KEY'
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
