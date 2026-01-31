const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/webhook.controller');

// Alchemy address activity webhook
router.post('/alchemyevm', webhookController.handleAlchemyEvm);

module.exports = router;
