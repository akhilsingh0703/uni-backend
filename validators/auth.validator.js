// backend/validators/auth.validator.js
const { body } = require('express-validator');

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
    
  body('password')
    .if((value, { req }) => !req.body.phoneNumber)
    .notEmpty().withMessage('Password is required when not using phone login')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
    
  body('phoneNumber')
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage('Please enter a valid phone number'),
    
  body('educationalDetails')
    .optional()
    .isObject().withMessage('Educational details must be an object'),
    
  body('educationalDetails.institution')
    .if(body('educationalDetails').exists())
    .notEmpty().withMessage('Institution name is required')
    .isString().withMessage('Institution must be a string'),
    
  body('educationalDetails.degree')
    .if(body('educationalDetails').exists())
    .notEmpty().withMessage('Degree is required')
    .isString().withMessage('Degree must be a string'),
    
  body('educationalDetails.fieldOfStudy')
    .if(body('educationalDetails').exists())
    .notEmpty().withMessage('Field of study is required')
    .isString().withMessage('Field of study must be a string'),
    
  body('educationalDetails.graduationYear')
    .if(body('educationalDetails').exists())
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage('Please enter a valid graduation year')
];

const validateLogin = [
  body('email')
    .if((value, { req }) => !req.body.phoneNumber)
    .trim()
    .notEmpty().withMessage('Email is required when not using phone login')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
    
  body('password')
    .if((value, { req }) => !req.body.phoneNumber)
    .notEmpty().withMessage('Password is required when not using phone login'),
    
  body('phoneNumber')
    .if((value, { req }) => !req.body.email)
    .notEmpty().withMessage('Phone number is required when not using email login')
    .isMobilePhone().withMessage('Please enter a valid phone number'),
    
  body('otp')
    .if((value, { req }) => req.body.phoneNumber)
    .notEmpty().withMessage('OTP is required for phone login')
    .isNumeric().withMessage('OTP must be a number')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

const validatePhoneVerification = [
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Please enter a valid phone number'),
    
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isNumeric().withMessage('OTP must be a number')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

const validateRefreshToken = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePhoneVerification,
  validateRefreshToken
};