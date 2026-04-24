const { z } = require('zod');

const COLLEGE_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'college.edu';

const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),

  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address')
    .refine(
      (email) => email.endsWith(`@${COLLEGE_DOMAIN}`),
      `Must use a college email ending in @${COLLEGE_DOMAIN}`
    )
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  department: z.string().max(100).optional(),

  year: z
    .number()
    .int()
    .min(1, 'Year must be between 1 and 6')
    .max(6, 'Year must be between 1 and 6')
    .optional(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

const verifyOTPSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address'),

  otp: z
    .string({ required_error: 'OTP is required' })
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required' }).min(1),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'New password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
