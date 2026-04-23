import jwt from 'jsonwebtoken';
import { jwtTokenValidationSchema } from '../validations/user.validation.js';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_SECRET_EXPIRY;

if (!jwtSecret || !jwtExpiry)
  throw new Error('Environment variables must be set for JWT functionality');

const jwtOptions = {
  expiresIn: jwtExpiry,
  notBefore: '0s',
};

export async function validateUserAndCreateJwtToken(user) {
  const validated = await jwtTokenValidationSchema.safeEncodeAsync(user);

  if (validated.error) throw new Error(validated.error.message);

  const jwtToken = jwt.sign(validated.data, jwtSecret, jwtOptions);

  return jwtToken;
}

export function validateJwtToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, jwtSecret);
  } catch (error) {
    return null;
  }
}
