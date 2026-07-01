// controller for user-related operations
const wallet = require('../models/wallet');


// create a new wallet for a user
const createWallet = async (req, res) => {
    try {
        const { user_id } = req.body;
        const newWallet = await wallet.createWallet(user_id);
        res.status(201).json(newWallet);
    } catch (err) {
        console.error('Error creating wallet:', err);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
};


// get wallet details by user id
const getWalletByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userWallet = await wallet.findByUserId(user_id);
        if (!userWallet) {
            return res.status(404).json({ error: 'Wallet not found for this user' });
        }
        res.json(userWallet);
    } catch (err) {
        console.error('Error fetching wallet:', err);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }
};


// get wallet detail by wallet id
const getWalletById = async (req, res) => {
    try {
        const { wallet_id } = req.params;
        const db = require('../utils/database').getDb();
        const result = await db.query(
            'SELECT * FROM wallets WHERE wallet_id = $1',
            [wallet_id]
        );
        const walletDetails = result.rows[0];
        if (!walletDetails) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json(walletDetails);
    } catch (err) {
        console.error('Error fetching wallet by ID:', err);
        res.status(500).json({ error: 'Failed to fetch wallet by ID' });
    }
};


// deposit amount to wallet by wallet id
const depositToWallet = async (req, res) => {
    try {
        const { wallet_id } = req.params;
        const { amount } = req.body;
        const updatedWallet = await wallet.deposit(wallet_id, amount);
        if (!updatedWallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json(updatedWallet);
    } catch (err) {
        console.error('Error depositing to wallet:', err);
        res.status(500).json({ error: 'Failed to deposit to wallet' });
    }
};


// withdraw amount from wallet by wallet id
const withdrawFromWallet = async (req, res) => {
    try {
        const { wallet_id } = req.params;
        const { amount } = req.body;
        const updatedWallet = await wallet.withdraw(wallet_id, amount);
        if (!updatedWallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json(updatedWallet);
    } catch (err) {
        console.error('Error withdrawing from wallet:', err);
        res.status(500).json({ error: 'Failed to withdraw from wallet' });
    }
};


module.exports = { createWallet, getWalletByUserId, getWalletById, depositToWallet, withdrawFromWallet };
