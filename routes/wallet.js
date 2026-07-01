const express = require('express');

const router = express.Router();

//create a walletController
const WalletController = require('../controllers/walletController.js');

// get user wallet by user id
router.get('/user/:user_id', WalletController.getWalletByUserId);

router.get('/:wallet_id', WalletController.getWalletById);


// route for depositing amount to wallet by wallet id
router.post('/:wallet_id/deposit', WalletController.depositToWallet);

// route for withdrawing amount from wallet by wallet id
router.post('/:wallet_id/withdraw', WalletController.withdrawFromWallet);




module.exports = router;
