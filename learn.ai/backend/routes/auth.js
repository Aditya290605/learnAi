import express from 'express';
import { body } from 'express-validator';
import {
  signup,
  signin,
  getMe,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateSignin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/signin', validateSignin, signin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);
router.post('/logout', protect, logout);

export default router;
