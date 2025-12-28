const { db, admin } = require('../firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class AuthController {
  // Login user
  static async login(req, res) {
    try {
      // Input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, phoneNumber, otp } = req.body;

      // Check if using email/password or phone/otp
      if ((!email || !password) && (!phoneNumber || !otp)) {
        return res.status(400).json({ 
          message: 'Either email/password or phone/OTP is required' 
        });
      }

      // Find user by email
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', email).get();

      if (userQuery.empty) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userDoc = userQuery.docs[0];
      const user = userDoc.data();

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userDoc.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: userDoc.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Generate OTP
  static async generateOTP(phoneNumber) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 5 * 60 * 1000; // 5 minutes
    
    await db.collection('otpVerifications').doc(phoneNumber).set({
      otp,
      expiresAt: Date.now() + ttl
    });

    // In production, send OTP via SMS
    if (process.env.NODE_ENV === 'production') {
      await twilioClient.messages.create({
        body: `Your OTP for verification is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
    }

    return otp;
  }

  // Verify OTP
  static async verifyOTP(phoneNumber, otp) {
    const otpDoc = await db.collection('otpVerifications').doc(phoneNumber).get();
    
    if (!otpDoc.exists) {
      throw new Error('OTP not found or expired');
    }

    const { otp: storedOTP, expiresAt } = otpDoc.data();
    
    if (Date.now() > expiresAt) {
      await otpDoc.ref.delete();
      throw new Error('OTP expired');
    }

    if (otp !== storedOTP) {
      throw new Error('Invalid OTP');
    }

    await otpDoc.ref.delete();
    return true;
  }

  // Register user
  static async register(req, res) {
    try {
      // Input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phoneNumber, educationalDetails } = req.body;

      // Check if user with same email or phone exists
      const usersRef = db.collection('users');
      const existingUser = await usersRef
        .where('email', '==', email)
        .orWhere('phoneNumber', '==', phoneNumber)
        .get();

      if (!existingUser.empty) {
        return res.status(400).json({ message: 'User with this email or phone already exists' });
      }

      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      // Prepare user data
      const userData = {
        name,
        email,
        phoneNumber,
        ...(hashedPassword && { password: hashedPassword }),
        educationalDetails: {
          ...educationalDetails,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        },
        emailVerified: false,
        phoneVerified: phoneNumber ? false : null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        role: 'student',
        status: 'active'
      };

      // Save user to Firestore
      const userRef = await usersRef.add(userData);

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: userRef.id, email, role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: userRef.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );

      // Save refresh token
      await db.collection('refreshTokens').doc(userRef.id).set({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Send verification email
      // TODO: Implement email verification

      res.status(201).json({
        message: 'User registered successfully. Please verify your email.',
        accessToken,
        refreshToken,
        user: {
          id: userRef.id,
          name,
          email,
          phoneNumber,
          role: 'student'
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Logout user (client-side token removal, but we can log it)
  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const { userId } = req.user;

      // Delete the refresh token
      await db.collection('refreshTokens').doc(userId).delete();

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Refresh token endpoint
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const tokenDoc = await db.collection('refreshTokens').doc(decoded.userId).get();

      if (!tokenDoc.exists || tokenDoc.data().token !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Generate new access token
      const userDoc = await db.collection('users').doc(decoded.userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userDoc.data();
      const newAccessToken = jwt.sign(
        { userId: userDoc.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRES_IN
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(403).json({ message: 'Invalid refresh token' });
    }
  }

  // Send OTP to phone number
  static async sendOTP(req, res) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      const otp = await AuthController.generateOTP(phoneNumber);
      
      // In development, return the OTP for testing
      if (process.env.NODE_ENV !== 'production') {
        return res.json({ 
          message: 'OTP sent successfully',
          otp // Only for development/testing
        });
      }

      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  }

  // Verify phone number with OTP
  static async verifyPhone(req, res) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
      }

      await AuthController.verifyOTP(phoneNumber, otp);
      
      // Update user's phone verification status
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('phoneNumber', '==', phoneNumber).get();
      
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
          phoneVerified: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      res.json({ message: 'Phone number verified successfully' });
    } catch (error) {
      console.error('Verify phone error:', error);
      res.status(400).json({ message: error.message || 'Failed to verify phone number' });
    }
  }

  // Add this method to the AuthController class
  static async getCurrentUser(req, res) {
    try {
      const userDoc = await db.collection('users').doc(req.user.userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userDoc.data();
      
      // Don't send sensitive data
      const { password, ...userData } = user;
      
      res.json({
        ...userData,
        id: userDoc.id
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
