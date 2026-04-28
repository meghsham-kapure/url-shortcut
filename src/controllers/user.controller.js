import {
  createUser,
  findUserByEmailId,
  findUserByPhone,
  findUserByUsername,
  isPasswordMatching,
} from '../services/user.service.js';
import getTimestamp from '../utils/getTimestamp.util.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import {
  createUserSession,
  deleteSessionById,
  findSessionByUserId,
} from './../services/session.service.js';
import getCookiesOptions from './../utils/getCookiesOptions.util.js';
import { generateAccessToken, validateToken } from './../utils/jwtHelper.util.js';
import { createSaltedPassword } from './../utils/saltedPassword.util.js';

export async function userRegistration(req, res) {
  console.info(
    `${getTimestamp()} userRegistration request received with body: ${JSON.stringify(req.validated.body)}`
  );

  const { username, firstName, lastName, birthDate, email, phone, password } = req.validated.body;
  const { hashedPassword, salt } = createSaltedPassword(password);

  const user = {
    username,
    firstName,
    lastName,
    birthDate,
    email,
    phone,
    password: hashedPassword,
    salt,
  };

  try {
    const createdUser = await createUser(user);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User Registration request successful',
      createdUserId: createdUser.id,
    });
  } catch (error) {
    if (error.cause.code === '23505') {
      console.error(
        `${getTimestamp()} ERROR : Duplicate user register request email ${email}. Error: Table[${error.cause.table}]:${error.cause.detail}`
      );

      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: error.cause.detail,
      });
    }

    console.error(
      `${getTimestamp()} ERROR : Failed to create user record for email ${email}. Error: ${JSON.stringify(error)}`
    );

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Server error occurred while processing the user registration request',
    });
  }
}

export async function userLogin(req, res) {
  console.info(
    `${getTimestamp()} userLogin request received with body: ${JSON.stringify(req.validated.body)}`
  );

  const { email, username, phone, password } = req.validated.body;

  let existingUser;

  if (username) [existingUser] = await findUserByUsername(username);
  else if (email) [existingUser] = await findUserByEmailId(email);
  else if (phone) [existingUser] = await findUserByPhone(phone);

  if (!existingUser) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // try catch integrations
  const passwordMatched = await isPasswordMatching(
    password,
    existingUser.password,
    existingUser.salt
  );

  if (!passwordMatched) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  let session = await findSessionByUserId(existingUser.id);

  if (!session) {
    session = await createUserSession(existingUser.id);
  }

  const verifiedRefreshToken = validateToken(
    session.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (verifiedRefreshToken.status === 'InvalidToken') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: verifiedRefreshToken.status,
    });
  }

  if (verifiedRefreshToken.status === 'TokenExpiredError') {
    const deletedSession = await deleteSessionById(session.id);
    session = await createUserSession(existingUser.id);
  }

  const accessToken = await generateAccessToken({ userId: existingUser.id, sessionId: session.id });

  res.cookie('accessToken', accessToken, getCookiesOptions());

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken: accessToken,
  });
}
