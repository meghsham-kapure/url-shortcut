import { z } from 'zod';

import {
  NameSchema,
  EmailSchema,
  PasswordSchema,
  IdSchema,
  AddressSchema,
} from './app.validations.js';

export const registerUserRequestSchema = z
  .object({
    body: z
      .object({
        firstName: NameSchema,
        lastName: NameSchema.optional(),
        email: EmailSchema,
        address: AddressSchema.optional(),
        password: PasswordSchema,
      })
      .strict(),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
  })
  .strict();

export const loginUserRequestSchema = z.object({
  body: z
    .object({
      email: EmailSchema,
      password: PasswordSchema,
    })
    .strict(),
});

export const jwtTokenValidationSchema = z.object({
  id: IdSchema,
});

