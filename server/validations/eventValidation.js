const { z } = require('zod');

const createEventSchema = z.object({
  title: z
    .string({ required_error: 'Event title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(200)
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10)
    .max(5000)
    .trim(),

  category: z.enum(
    ['workshop', 'seminar', 'cultural', 'sports', 'technical', 'general'],
    { errorMap: () => ({ message: 'Invalid event category' }) }
  ),

  startDate: z
    .string({ required_error: 'Start date is required' })
    .refine((val) => !isNaN(Date.parse(val)), 'Must be a valid date'),

  endDate: z
    .string({ required_error: 'End date is required' })
    .refine((val) => !isNaN(Date.parse(val)), 'Must be a valid date'),

  location: z
    .string({ required_error: 'Location is required' })
    .min(3)
    .max(200)
    .trim(),

  maxAttendees: z
    .number()
    .int()
    .min(1)
    .max(10000)
    .optional(),

  isOnline: z.boolean().optional().default(false),

  meetingLink: z
    .string()
    .url('Must be a valid URL')
    .optional(),
});

const updateEventSchema = createEventSchema.partial();

module.exports = { createEventSchema, updateEventSchema };
