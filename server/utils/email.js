const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `UniCast <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    logger.info('Email sent successfully', {
      to,
      subject,
      messageId: info.messageId,
    });

    return info;
  } catch (err) {
    logger.error('Email sending failed', {
      to,
      subject,
      error: err.message,
    });
    throw err;
  }
};

exports.sendOTPEmail = async (email, otp, fullName) => {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e4e4e7;">
      <div style="background: #111827; padding: 16px 20px; margin-bottom: 32px;">
        <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.03em;">UniCast</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;">Verify your email address</h2>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Hi ${fullName}, use the OTP below to verify your UniCast account. This code expires in 10 minutes.
      </p>
      <div style="background: #f3f4f6; border: 1px solid #e4e4e7; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #111827;">${otp}</span>
      </div>
      <p style="color: #9ca3af; font-size: 12px;">
        If you did not create a UniCast account, ignore this email.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'UniCast - Verify Your Email Address',
    html,
  });
};

exports.sendWelcomeEmail = async (email, fullName) => {
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e4e4e7;">
      <div style="background: #111827; padding: 16px 20px; margin-bottom: 32px;">
        <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.03em;">UniCast</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;">Welcome to UniCast, ${fullName}</h2>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Your account has been verified successfully. You can now upload videos, join clubs, and explore campus content.
      </p>
      <a href="${process.env.CLIENT_URL}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 600; text-decoration: none;">
        Go to UniCast
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to UniCast',
    html,
  });
};

exports.sendPasswordResetEmail = async (email, fullName, resetToken) => {
  const resetURL = \`\${process.env.CLIENT_URL}/reset-password?token=\${resetToken}\`;

  const html = \`
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e4e4e7;">
      <div style="background: #111827; padding: 16px 20px; margin-bottom: 32px;">
        <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.03em;">UniCast</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;">Reset your password</h2>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Hi \${fullName}, click the button below to reset your password. This link expires in 10 minutes.
      </p>
      <a href="\${resetURL}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 600; text-decoration: none; margin-bottom: 24px;">
        Reset Password
      </a>
      <p style="color: #9ca3af; font-size: 12px;">
        If you did not request a password reset, ignore this email. Your password will not change.
      </p>
    </div>
  \`;

  return sendEmail({
    to: email,
    subject: 'UniCast - Reset Your Password',
    html,
  });
};
