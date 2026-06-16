const express = require('express');

const router = express.Router();

// import auth controller
const AuthController = require('../controllers/auth');

// route for showing the login page
router.get('/login', AuthController.getLogin);

// route for handling login submission
router.post('/login', AuthController.postLogin);

module.exports = router;
