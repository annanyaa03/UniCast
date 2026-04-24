const crypto = require('crypto');
const logger = require('../config/logger');

exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

exports.generateOTPExpiry = (minutesFromNow = 10) => {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
};

exports.isOTPExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

exports.hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};
