import jwt from 'jsonwebtoken';

import {
  accessTokenValidationSchema,
  refreshTokenValidationSchema,
} from '../validations/user.validation.js';

// For JWT token creation
const accessTokenOptions = { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY };
const refreshTokenOptions = { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY };

export async function generateAccessToken(accessTokenPayload) {
  try {
    const validateAccessToken = await accessTokenValidationSchema.safeParse(accessTokenPayload);
    if (validateAccessToken.error) throw new Error(validateAccessToken.error.message);
    return jwt.sign(validateAccessToken.data, process.env.ACCESS_TOKEN_SECRET, accessTokenOptions);
  } catch (error) {
    console.error(error);
  }
}

export async function generateRefreshToken(refreshTokenPayload) {

  try {
    const validateRefreshToken = await refreshTokenValidationSchema.safeParse(refreshTokenPayload);

    if (validateRefreshToken.error) throw new Error(validateRefreshToken.error.message);

    const refreshTokenEncoded = jwt.sign(
      validateRefreshToken.data,
      process.env.REFRESH_TOKEN_SECRET,
      refreshTokenOptions
    );

    const decodedRefreshToken = jwt.decode(refreshTokenEncoded);

    return {
      refreshTokenEncoded,
      createdAt: decodedRefreshToken.iat,
      expiresAt: decodedRefreshToken.exp,
    };

  } catch (error) {
    console.error(error);
  }
}

export function validateToken(token, secret) {
  try {
    const verifiedData = jwt.verify(token, secret);
    return { status: 'VerifiedToken', data: verifiedData };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { status: error.name, data: jwt.decode(token) };
    } else {
      return { status: 'InvalidToken', error: `${error.name} : ${error.message}` };
    }
  }
}

export const decodeJwt = (token) => jwt.decode(token);
