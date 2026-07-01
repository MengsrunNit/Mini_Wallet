const express = require('express');

const router = express.Router();

const TransferController = require('../controllers/transferController.js');

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// route for transferring funds between two wallets
router.post('/', TransferController.transferFunds);

// route for transferring funds from the logged-in user to a recipient by email
router.post('/by-email', isLoggedIn, TransferController.transferByEmail);

module.exports = router;
