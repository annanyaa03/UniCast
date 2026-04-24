const { z } = require('zod');

const uploadVideoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),

  description: z
    .string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional(),

  category: z
    .enum(
      ['education', 'cultural', 'sports', 'technical', 'events', 'clubs', 'general'],
      { errorMap: () => ({ message: 'Invalid category selected' }) }
    )
    .default('general'),

  visibility: z
    .enum(['public', 'unlisted', 'private'])
    .default('public'),

  tags: z
    .array(z.string().trim().toLowerCase().max(30))
    .max(15, 'Cannot have more than 15 tags')
    .optional()
    .default([]),

  isShort: z.boolean().optional().default(false),
});

const updateVideoSchema = z.object({
  title: z.string().min(3).max(200).trim().optional(),
  description: z.string().max(5000).optional(),
  category: z
    .enum(['education', 'cultural', 'sports', 'technical', 'events', 'clubs', 'general'])
    .optional(),
  visibility: z.enum(['public', 'unlisted', 'private']).optional(),
  tags: z.array(z.string().trim().toLowerCase().max(30)).max(15).optional(),
});

const addChapterSchema = z.object({
  chapters: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        timestamp: z.number().min(0),
      })
    )
    .min(1, 'At least one chapter is required'),
});

module.exports = { uploadVideoSchema, updateVideoSchema, addChapterSchema };
