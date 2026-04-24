const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/jwt');
const { generateOTP, generateOTPExpiry, isOTPExpired } = require('../utils/otp');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const logger = require('../config/logger');
const crypto = require('crypto');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, username, email, password, department, year } = req.validatedData || req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const otp = generateOTP(6);
    const otpExpiry = generateOTPExpiry(10);

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      department,
      year,
      emailOTP: otp,
      emailOTPExpiry: otpExpiry,
    });

    await sendOTPEmail(email, otp, fullName);

    logger.info('New user registered', {
      userId: user._id,
      email: user.email,
      username: user.username,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created. Please check your email for the OTP.',
      otpRequired: true,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData || req.body;

    const user = await User.findOne({ email }).select('+password +twoFA');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Failed login attempt', { email, ip: req.ip });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Account banned. Reason: ${user.banReason || 'Policy violation'}`,
      });
    }

    if (!user.isVerified) {
      const otp = generateOTP(6);
      user.emailOTP = otp;
      user.emailOTPExpiry = generateOTPExpiry(10);
      await user.save({ validateBeforeSave: false });
      await sendOTPEmail(email, otp, user.fullName);

      return res.status(200).json({
        success: false,
        message: 'Please verify your email. A new OTP has been sent.',
        otpRequired: true,
        email: user.email,
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    logger.info('User logged in', { userId: user._id, email: user.email });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
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
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (isOTPExpired(user.emailOTPExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
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

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
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
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.isBanned) {
      return res.status(401).json({ success: false, message: 'User not found or banned' });
    }

    const accessToken = generateAccessToken(user._id);

    return res.status(200).json({ success: true, accessToken });
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

    return res.status(200).json({
      success: true,
      message: 'If this email exists, a password reset link has been sent.',
    });
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
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    logger.info('User password reset', { userId: user._id });

    return res.status(200).json({ success: true, message: 'Password reset successful. Please log in.' });
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
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const otp = generateOTP(6);
    user.emailOTP = otp;
    user.emailOTPExpiry = generateOTPExpiry(10);
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(email, otp, user.fullName);

    return res.status(200).json({ success: true, message: 'New OTP sent to your email' });
  } catch (err) {
    next(err);
  }
};
