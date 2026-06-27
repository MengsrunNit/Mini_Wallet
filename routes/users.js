const express = require('express');

const router = express.Router();

// import user controller
const UserController = require('../controllers/userControllers');

// route for showing all users



router.get('/id/:id', UserController.findUserById);

router.get('/email/:email', UserController.findUserByEmail); 

module.exports = router;