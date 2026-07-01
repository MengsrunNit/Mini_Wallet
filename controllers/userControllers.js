// controller for user-related operations
const User = require('../models/users');


// find user information by id 
const findUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};


const findUserByEmail = async (req, res) => {
    try {
        const user = await User.findByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user by email:', err);
        res.status(500).json({ error: 'Failed to fetch user by email' });
    }

};


const getUserWallet = async (req, res) => {
    // using uuid 
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const wallet = await Wallet.findByUserId(user.user_id);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found for this user' });
        }
        res.json(wallet);
    } catch (err) {
        console.error('Error fetching user wallet:', err);
        res.status(500).json({ error: 'Failed to fetch user wallet' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.deleteById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { findUserById, findUserByEmail, deleteUser };