
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users');

const getLogin = (req, res) => {
    res.render('auth/login', { title: 'Login Page' });

};

const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

const getSignup = (req, res) =>{
    res.render('auth/signup', { title: 'Signup Page' });
}

const postSignup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(username, email, hashedPassword);
        res.render('auth/login', { title: 'Login Page' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Failed to signup' });
    }
};

module.exports = { getLogin, postLogin, getSignup, postSignup };