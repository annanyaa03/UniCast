const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/authValidation');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
