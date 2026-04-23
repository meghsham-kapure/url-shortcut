import dbConnection from '../db/connection.db.js';
import users from '../models/user.model.js';
import { eq } from 'drizzle-orm';
import { createSaltedPassword } from '../utils/saltedPassword.util.js';
import { email } from 'zod';

export const createUser = async function (user) {
  const [newUser] = await dbConnection
    .insert(users)
    .values({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      salt: user.salt,
      password: user.password,
    })
    .returning({ id: users.id });

  return newUser;
};

export const readUsers = async function () {
  return await dbConnection.select().from(users).where(selectCondition);
};

export const findUserByEmailId = async function (email) {
  if (!email) throw new Error('In User-Service findUserByEmailId(email), email is not found! ');

  return await dbConnection
    .select({
      id: users.id,
      email: users.email,
      salt: users.salt,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
};

export const findUserById = async function (userId) {
  if (!userId) throw new Error('In User-Service findUserBy(userId), userId is not found! ');
  const [result] = await dbConnection.select().from(users).where(eq(users.id, userId)).limit(1);
  return result;
};

export const deleteUser = async function (userId) {
  return await db.delete(users).where(eq(users.id, userId)).returning();
};

export const updateUserPatch = async function (userId, updates) {};

export const createUserPut = async function (userId, user) {};

export const readUserById = async function (userId) {
  return await dbConnection.select().from(users).where(eq(users.id, userId));
};

export const isPasswordMatching = async function (plainPassword, oldHashedPassword, salt) {
  return createSaltedPassword(plainPassword, salt).hashedPassword === oldHashedPassword;
};
