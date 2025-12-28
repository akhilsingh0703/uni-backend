// backend/routes/auth.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const { 
  validateRegister, 
  validateLogin, 
  validatePhoneVerification, 
  validateRefreshToken 
} = require('../validators/auth.validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/auth/register - Register user
router.post('/register', validateRegister, AuthController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, AuthController.login);

// POST /api/auth/logout - Logout user
router.post('/logout', authMiddleware, AuthController.logout);

// POST /api/auth/refresh-token - Refresh access token
router.post('/refresh-token', validateRefreshToken, AuthController.refreshToken);

// POST /api/auth/send-otp - Send OTP to phone number
router.post('/send-otp', AuthController.sendOTP);

// POST /api/auth/verify-phone - Verify phone number with OTP
router.post('/verify-phone', validatePhoneVerification, AuthController.verifyPhone);

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;