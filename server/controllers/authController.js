const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/jwt');
const { generateOTP, generateOTPExpiry, isOTPExpired } = require('../utils/otp');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const logger = require('../config/logger');
const crypto = require('crypto');
const { recordFailedAttempt, isAccountLocked, clearLoginAttempts } = require('../utils/loginAttempts');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, username, email, password, department, year } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username is already taken' 
      });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      department,
      year: parseInt(year) || undefined,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        year: user.year,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData || req.body;

    // Check if account is locked
    const locked = await isAccountLocked(email);
    if (locked) {
      return sendError(res, 429, 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.');
    }

    const user = await User.findOne({ email }).select('+password +twoFA');
    if (!user) {
      await recordFailedAttempt(email);
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const { locked: nowLocked, remaining } = await recordFailedAttempt(email);
      logger.warn('Failed login attempt', { email, ip: req.ip });

      if (nowLocked) {
        return sendError(res, 429, 'Too many failed attempts. Account locked for 15 minutes.');
      }

      return sendError(res, 401, `Invalid email or password. ${remaining} attempts remaining.`);
    }

    // Clear attempts on successful login
    await clearLoginAttempts(email);

    if (user.isBanned) {
      return sendError(res, 403, `Account banned. Reason: ${user.banReason || 'Policy violation'}`);
    }

    if (!user.isVerified) {
      const otp = generateOTP(6);
      user.emailOTP = otp;
      user.emailOTPExpiry = generateOTPExpiry(10);
      await user.save({ validateBeforeSave: false });
      await sendOTPEmail(email, otp, user.fullName);

      return sendError(res, 403, 'Please verify your email. A new OTP has been sent.');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    logger.info('User logged in', { userId: user._id, email: user.email });

    return sendSuccess(res, 200, 'Login successful', {
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        year: user.year,
        isVerified: user.isVerified,
        isVerifiedBadge: user.isVerifiedBadge,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.validatedData || req.body;

    const user = await User.findOne({ email }).select('+emailOTP +emailOTPExpiry');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
      return sendError(res, 400, 'Invalid OTP');
    }

    if (isOTPExpired(user.emailOTPExpiry)) {
      return sendError(res, 400, 'OTP has expired. Please request a new one.');
    }

    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    await sendWelcomeEmail(email, user.fullName);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    logger.info('User email verified', { userId: user._id });

    return sendSuccess(res, 200, 'Email verified successfully', {
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        isVerified: true,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    logger.info('User logged out', { userId: req.user?._id });
    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendError(res, 401, 'No refresh token provided');
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user || user.isBanned) {
      return sendError(res, 401, 'User not found or banned');
    }

    const accessToken = generateAccessToken(user._id);

    return sendSuccess(res, 200, 'Token refreshed', { accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.validatedData || req.body;

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.emailOTP = resetToken;
      user.emailOTPExpiry = generateOTPExpiry(10);
      await user.save({ validateBeforeSave: false });
      await sendPasswordResetEmail(email, user.fullName, resetToken);
    }

    return sendSuccess(res, 200, 'If this email exists, a password reset link has been sent.');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.validatedData || req.body;

    const user = await User.findOne({
      emailOTP: token,
      emailOTPExpiry: { $gt: Date.now() },
    }).select('+emailOTP +emailOTPExpiry');

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    user.password = password;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    logger.info('User password reset', { userId: user._id });

    return sendSuccess(res, 200, 'Password reset successful. Please log in.');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/resend-otp
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (user.isVerified) {
      return sendError(res, 400, 'Email is already verified');
    }

    const otp = generateOTP(6);
    user.emailOTP = otp;
    user.emailOTPExpiry = generateOTPExpiry(10);
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(email, otp, user.fullName);

    return sendSuccess(res, 200, 'New OTP sent to your email');
  } catch (err) {
    next(err);
  }
};
