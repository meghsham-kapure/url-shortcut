import { z } from 'zod';

export const NameSchema = z
  .string()
  .trim()
  .min(3)
  .max(50)
  .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Only letters and spaces between words allowed');

export const PasswordSchema = z
  .string()
  .trim()
  .min(8)
  .max(32)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,32}$/, {
    message: 'Password must contain upper, lower, number, symbol and be 8 to 32 chars',
  });

export const AddressSchema = z
  .string()
  .regex(/^[A-Za-z,\-\/\s]+$/, 'Only letters, comma, dash, slash, and spaces allowed');

export const EmailSchema = z
  .string()
  .trim()
  .min(5)
  .email()
  .transform((email) => email.toLowerCase());

  export const IdSchema = z.uuid();

  export const UsernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(/^(?!.*[._]{3,})[a-z0-9][a-z0-9._]*[a-z0-9]$/, {
      message:
        'Username must be 3-30 characters, start and end with a letter or number, contain only letters, numbers, dot (.) and underscore (_), and cannot contain 3 consecutive symbols',
    });

  export const PhoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid E.164 phone number');

  export const BirthDateSchema = z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Invalid format. Use YYYY-MM-DD');
