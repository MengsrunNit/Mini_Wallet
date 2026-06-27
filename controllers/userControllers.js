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

module.exports = { findUserById, findUserByEmail };