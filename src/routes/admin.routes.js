const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');

// Admin dashboard
router.get('/stats', auth, role('ADMIN'), adminController.getStats);

// Users list
router.get('/users', auth, role('ADMIN'), adminController.getUsers);

// View user wallets
router.get('/wallets', auth, role('ADMIN'), adminController.getAllWallets);

// Sweep buffer → main
router.post('/sweep/:userId', auth, role('ADMIN'), adminController.sweepUserFunds);

// Withdraw approvals
router.get('/withdrawals', auth, role('ADMIN'), adminController.getWithdrawRequests);
router.post('/withdrawals/approve/:ledgerId', auth, role('ADMIN'), adminController.approveWithdraw);




// Networks
router.post('/networks', auth, role('ADMIN'), adminController.createNetwork);
router.get('/networks', auth, role('ADMIN'), adminController.getNetworks);

// Tokens
router.post('/tokens', auth, role('ADMIN'), adminController.createToken);
router.get('/tokens', auth, role('ADMIN'), adminController.getTokens);
module.exports = router;
