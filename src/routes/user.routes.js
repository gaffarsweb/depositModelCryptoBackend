const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');

// USER dashboard
router.get('/me', auth, role('USER'), userController.getProfile);

// Wallet info (deposit address)
router.get('/wallets', auth, role('USER'), userController.getWallet);

// Balance
router.get('/balances', auth, role('USER'), userController.getBalance);

// Withdrawal request
router.post('/withdraw', auth, role('USER'), userController.requestWithdraw);

// Ledger / history
router.get('/transactions', auth, role('USER'), userController.getTransactions);



router.get('/networks', auth, userController.getNetworks);
router.get('/tokens/:networkId', auth, userController.getTokensByNetwork);

module.exports = router;
