const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// POST /api/auth/login - Login user
router.post('/login', AuthController.login);

// POST /api/auth/register - Register user
router.post('/register', AuthController.register);

// POST /api/auth/logout - Logout user
router.post('/logout', AuthController.logout);

module.exports = router;
