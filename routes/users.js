const express = require('express');

const router = express.Router();

// import user controller
const UserController = require('../controllers/userControllers');

// route for showing all users
router.get('/', UserController.getAllUsers);

module.exports = router;