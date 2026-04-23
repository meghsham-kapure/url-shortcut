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
