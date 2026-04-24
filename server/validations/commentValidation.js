const { z } = require('zod');

const createCommentSchema = z.object({
  content: z
    .string({ required_error: 'Comment content is required' })
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters')
    .trim(),

  parentComment: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid comment ID')
    .optional(),
});

const updateCommentSchema = z.object({
  content: z
    .string({ required_error: 'Content is required' })
    .min(1)
    .max(2000)
    .trim(),
});

module.exports = { createCommentSchema, updateCommentSchema };
