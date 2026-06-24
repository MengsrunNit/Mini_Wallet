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



module.exports = router;
