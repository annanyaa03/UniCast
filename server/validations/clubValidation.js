const { z } = require('zod');

const createClubSchema = z.object({
  name: z
    .string({ required_error: 'Club name is required' })
    .min(3, 'Club name must be at least 3 characters')
    .max(100)
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .max(2000)
    .trim(),

  category: z.enum(
    ['technical', 'cultural', 'sports', 'academic', 'social'],
    { errorMap: () => ({ message: 'Invalid club category' }) }
  ),

  contactEmail: z
    .string()
    .email('Must be a valid email address')
    .optional(),
});

const updateClubSchema = createClubSchema.partial();

module.exports = { createClubSchema, updateClubSchema };
