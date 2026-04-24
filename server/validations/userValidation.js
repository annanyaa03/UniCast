const { z } = require('zod');

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  department: z.string().max(100).optional(),
  year: z.number().int().min(1).max(6).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
      github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
      instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
      twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    })
    .optional(),
});

module.exports = { updateProfileSchema };
