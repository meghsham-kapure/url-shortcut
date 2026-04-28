import { z } from 'zod';

import {
  NameSchema,
  EmailSchema,
  PasswordSchema,
  IdSchema,
  AddressSchema,
  UsernameSchema,
  BirthDateSchema,
  PhoneSchema,
} from './app.validations.js';
import { SessionSchema } from './session.validation.js';

export const registerUserRequestSchema = z
  .object({
    body: z
      .object({
        username: UsernameSchema,
        firstName: NameSchema,
        lastName: NameSchema.optional(),
        birthDate: BirthDateSchema,
        email: EmailSchema,
        phone: PhoneSchema,
        password: PasswordSchema,
      })
      .strict(),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
  })
  .strict();

export const loginUserRequestSchema = z.object({
  body: z.union([
    z.object({ email: EmailSchema, password: PasswordSchema }).strict(),
    z.object({ username: UsernameSchema, password: PasswordSchema }).strict(),
    z.object({ phone: PhoneSchema, password: PasswordSchema }).strict(),
  ]),
});

export const jwtTokenValidationSchema = z.object({
  id: IdSchema,
});


export const accessTokenValidationSchema = z.object({
  userId: IdSchema,
  sessionId: IdSchema,
});

export const refreshTokenValidationSchema = z.object({
  userId: IdSchema,
});

