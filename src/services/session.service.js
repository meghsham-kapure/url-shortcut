import { eq } from 'drizzle-orm';
import dbConnection from '../db/connection.db.js';
import sessions from '../models/session.model.js';
import { generateRefreshToken } from '../utils/jwtHelper.util.js';
import unixValueToTimestamp from '../utils/unixValueToTimestamp.util.js';

export async function findSessionByUserId(userId) {
  if (!userId) throw new Error('In user.service.findSessionByUserId(userId), userId not provided!');
  const [session] = await dbConnection.select().from(sessions).where(eq(sessions.userId, userId));
  return session;
}

export async function findSessionBySessionId(sessionId) {
  if (!sessionId)
    throw new Error('In user.service.findSessionBySessionId(sessionId), sessionId not provided!');

  const [session] = await dbConnection.select().from(sessions).where(eq(sessions.id, sessionId));
  return session;
}

export async function createUserSession(userId) {
  if (!userId) {
    throw new Error('In session.service.createUserSession(userId), userId not provided!');
  }

  const refreshTokenData = await generateRefreshToken({ userId: userId });

  const createdAt = unixValueToTimestamp(refreshTokenData.createdAt);
  const expiresAt = unixValueToTimestamp(refreshTokenData.expiresAt);

  const [session] = await dbConnection
    .insert(sessions)
    .values({
      userId: userId,
      refreshToken: refreshTokenData.refreshTokenEncoded,
      createdAt: createdAt,
      expiresAt: expiresAt,
    })
    .returning();

  return session;
}

export async function deleteSessionById(sessionId) {
  if (!sessionId) {
    throw new Error('In session.service.deleteSessionById(sessionId), sessionId not provided!');
  }
  const deleteSession = await dbConnection
    .delete(sessions)
    .where(eq(sessions.id, sessionId))
    .returning();
  return deleteSession;
}
