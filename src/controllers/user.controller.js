import { createUser, findUserByEmailId, isPasswordMatching } from '../services/user.service.js';
import { createSaltedPassword } from './../utils/saltedPassword.util.js';
import HTTP_STATUS from '../utils/httpStatus.util.js';
import { validateUserAndCreateJwtToken } from '../utils/jwtHelper.util.js';
import getTimestamp from '../utils/getTimestamp.util.js';

export async function userRegistration(req, res) {
  console.info(
    `${getTimestamp()} userRegistration request received with body: ${JSON.stringify(req.validated.body)}`
  );

  const { firstName, lastName, email, address, password } = req.validated.body;
  const { hashedPassword, salt } = createSaltedPassword(password);

  const user = {
    firstName,
    lastName,
    email,
    address,
    password: hashedPassword,
    salt,
  };

  try {
    const createdUser = await createUser(user);
    console.info(
      `${getTimestamp()} User record created successfully with ID: ${createdUser.id} for email: ${email}`
    );

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
        error: 'email is already associated with another user, try with different email',
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

  const { email, password } = req.validated.body;

  const [existingUser] = await findUserByEmailId(email);

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

  const jwtToken = await validateUserAndCreateJwtToken({
    id: existingUser.id,
  });

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    jwt: jwtToken,
  });
}
