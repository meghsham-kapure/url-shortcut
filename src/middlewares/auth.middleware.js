import getCookiesOptions from '../utils/getCookiesOptions.util.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import { generateAccessToken, validateToken } from '../utils/jwtHelper.util.js';
import { findSessionBySessionId } from './../services/session.service.js';
import { findUserById } from './../services/user.service.js';
import getTimestamp from './../utils/getTimestamp.util.js';

// Auth middleware
export default async function authenticate(req, res, next) {
  console.info(`${getTimestamp()} Authenticating request on ${req.originalUrl}`);

  const accessTokenFromCookie = req.cookies.accessToken;
  const accessTokenFromAuthHeader = req.header('Authorization')?.replace('Bearer ', '');

  if (accessTokenFromCookie && accessTokenFromAuthHeader) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: 'Multiple authentication sources provided' });
  }

  const accessToken = accessTokenFromCookie || accessTokenFromAuthHeader;

  if (!accessToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Authentication failed. Access token is missing',
    });
  }

  let accessTokenPayload = validateToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  console.log(accessTokenPayload);

  if (accessTokenPayload.status === 'VerifiedToken') {
    req.user = await findUserById(accessTokenPayload.data.userId);
    req.session = await findSessionBySessionId(accessTokenPayload.data.sessionId);
    return next();
  }

  if (accessTokenPayload.status === 'InvalidToken') {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ success: false, error: 'Authentication failed : Token Error' });
  }

  if (accessTokenPayload.status === 'TokenExpiredError') {
    const userId = accessTokenPayload.data.userId;
    const sessionId = accessTokenPayload.data.sessionId;
    const session = await findSessionBySessionId(sessionId);

    if (!session) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized User : Session not found, log-in required!',
      });
    }

    const refreshTokenPayload = validateToken(
      session.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (refreshTokenPayload.status === 'VerifiedToken') {
      const accessToken = await generateAccessToken({ userId: userId, sessionId: sessionId });
      res.cookie('accessToken', accessToken, getCookiesOptions());

      req.user = await findUserById(accessTokenPayload.data.userId);
      req.session = await findSessionBySessionId(accessTokenPayload.data.sessionId);
      return next();
    } else if (
      refreshTokenPayload.status === 'TokenExpiredError' ||
      refreshTokenPayload.status === 'InvalidToken'
    ) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Authentication failed. Invalid session',
      });
    } else {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, error: 'Authentication failed. Invalid session' });
    }
  }
}
