// controller for wallet-to-wallet transfers
const wallet = require('../models/wallet');

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

module.exports = { transferFunds };
