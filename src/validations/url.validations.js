import { z } from 'zod';

export const shortenUrlRequestSchema = z.object({
  targetUrl: z
    .string()
    .url({ message: 'Invalid URL format' })
    .trim()
    .max(256, { message: 'URL must be 256 characters or less' }),
});
