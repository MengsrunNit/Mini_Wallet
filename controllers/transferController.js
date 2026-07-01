// controller for wallet-to-wallet transfers
const wallet = require('../models/wallet');
const User = require('../models/users');

// transfer funds from the logged-in user's wallet to a recipient identified by email
const transferByEmail = async (req, res) => {
    try {
        const { to_email, amount } = req.body;
        const senderUserId = req.session.user.user_id;

        if (!to_email || !amount) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('Recipient email and amount are required'));
        }

        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('Amount must be a positive number'));
        }

        const recipientUser = await User.findByEmail(to_email);
        if (!recipientUser) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('No user found with that email'));
        }

        if (recipientUser.user_id === senderUserId) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('Cannot transfer to yourself'));
        }

        const senderWallet = await wallet.findByUserId(senderUserId);
        const recipientWallet = await wallet.findByUserId(recipientUser.user_id);

        if (!senderWallet || !recipientWallet) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('Wallet not found for sender or recipient'));
        }

        const result = await wallet.transferFunds(senderWallet.wallet_id, recipientWallet.wallet_id, numericAmount);
        if (!result) {
            return res.redirect('/dashboard?error=' + encodeURIComponent('Transfer failed: insufficient funds'));
        }

        res.redirect('/dashboard?success=' + encodeURIComponent(`Successfully sent ${numericAmount.toFixed(2)} to ${to_email}`));
    } catch (err) {
        console.error('Error transferring funds by email:', err);
        res.redirect('/dashboard?error=' + encodeURIComponent('Failed to transfer funds'));
    }
};

const transferFunds = async (req, res) => {
    try {
        const { from_wallet_id, to_wallet_id, amount } = req.body;

        if (!from_wallet_id || !to_wallet_id || !amount) {
            return res.status(400).json({ error: 'from_wallet_id, to_wallet_id, and amount are required' });
        }

        if (from_wallet_id === to_wallet_id) {
            return res.status(400).json({ error: 'Cannot transfer to the same wallet' });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than zero' });
        }

        const result = await wallet.transferFunds(from_wallet_id, to_wallet_id, amount);
        if (!result) {
            return res.status(400).json({ error: 'Transfer failed: insufficient funds or wallet not found' });
        }

        res.json(result);
    } catch (err) {
        console.error('Error transferring funds:', err);
        res.status(500).json({ error: 'Failed to transfer funds' });
    }
};

module.exports = { transferFunds, transferByEmail };
