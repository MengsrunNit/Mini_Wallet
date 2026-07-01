const express = require('express');

const router = express.Router();

// import auth controller
const AuthController = require('../controllers/auth');

// route for showing the login page
router.get('/login', AuthController.getLogin);

// route for handling login submission
router.post('/login', AuthController.postLogin);

router.get('/signup', AuthController.getSignup);

router.post('/signup', AuthController.postSignup);


// route for remove user session and logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.redirect('/auth/login');
    });
});





module.exports = router;
