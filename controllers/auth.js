
const express = require('express');

const { getDb } = require('../utils/database');

const getLogin = (req, res) => {
    res.render('auth/login', { title: 'Login Page' });

};

const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = getDb();
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        
        if (result.rows.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

const getSignup = (req, res) =>{
    res.render('auth/signup', { title: 'Signup Page' });
}

module.exports = { getLogin, postLogin, getSignup };