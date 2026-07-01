const express = require('express');

const router = express.Router();

const TransferController = require('../controllers/transferController.js');

// route for transferring funds between two wallets
router.post('/', TransferController.transferFunds);

module.exports = router;
