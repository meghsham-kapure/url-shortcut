import { z } from 'zod';

export const createShortcutRequestSchema = z.object({
  body: z.object({
    targetUrl: z
      .string()
      .trim()
      .max(256, {
        message: 'URL must be 256 characters or less',
      })
      .url({
        message: 'Invalid URL format',
      }),

    description: z
      .string()
      .trim()
      .max(256, {
        message: 'Description must be 256 characters or less',
      })
      .optional(),
  }),

  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
