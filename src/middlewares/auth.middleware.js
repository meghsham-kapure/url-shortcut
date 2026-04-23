import HTTP_STATUS from '../utils/httpStatus.util.js';
import { findUserById } from '../services/user.service.js';
import { validateJwtToken } from '../utils/jwtHelper.util.js';
import { jwtTokenValidationSchema } from '../validations/user.validation.js';
import getTimestamp from './../utils/getTimestamp.util.js';

export default async function authenticate(req, res, next) {
  console.info(`${getTimestamp()} Request on path: ${req.originalUrl} getting authenticated`);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Authorization header not provided',
    });
  }

  const authSplit = authHeader.trim().split(/\s+/);

  if (authSplit.length !== 2) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid authorization header format',
    });
  }

  const [scheme, token] = authSplit;

  if (scheme !== 'Bearer' || !token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid authorization header format',
    });
  }

  try {
    const tokenPayloadValue = validateJwtToken(token);

    if (!tokenPayloadValue) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Authorization header token provided is invalid/expired',
      });
    }

    const encodedPayload = jwtTokenValidationSchema.safeEncode(tokenPayloadValue);

    if (encodedPayload.success === false) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Authorization header token provided is not in expected format',
      });
    }

    const user = await findUserById(encodedPayload.data.id);

    if (!user) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: 'User in authorization header token is not active or does not exist',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error(
      `${getTimestamp()} Error during authentication: ${JSON.stringify(error.message)}`
    );

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
