import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Helper function to send success response
const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Helper function to send error response
const sendErrorResponse = (res, message = 'Error occurred', statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    // Send response
    sendSuccessResponse(res, {
      token,
      user: user.profile
    }, 'User registered successfully', 201);

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    if (error.code === 11000) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }
    
    sendErrorResponse(res, 'Internal server error', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return sendErrorResponse(res, 'Please provide email and password', 400);
    }

    // Check if user exists && password is correct
    const user = await User.findByEmail(email).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return sendErrorResponse(res, 'Incorrect email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendErrorResponse(res, 'Your account has been deactivated', 401);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    // Send response
    sendSuccessResponse(res, {
      token,
      user: user.profile
    }, 'Login successful');

  } catch (error) {
    console.error('Signin error:', error);
    sendErrorResponse(res, 'Internal server error', 500);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, {
      user: user.profile
    }, 'Profile retrieved successfully');

  } catch (error) {
    console.error('Get profile error:', error);
    sendErrorResponse(res, 'Internal server error', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, {
      user: user.profile
    }, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Internal server error', 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendErrorResponse(res, 'Please provide current and new password', 400);
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Check current password
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return sendErrorResponse(res, 'Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccessResponse(res, null, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Internal server error', 500);
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event or implement token blacklisting if needed
    sendSuccessResponse(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    sendErrorResponse(res, 'Internal server error', 500);
  }
};
