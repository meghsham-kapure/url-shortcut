import { and, eq } from 'drizzle-orm';
import dbConnection from './../db/connection.db.js';
import urls from './../models/url.model.js';

export async function createUrl(url) {
  try {
    const [urlRecord] = await dbConnection.insert(urls).values(url).returning({
      id: urls.id,
      shortcut: urls.shortcut,
      targetUrl: urls.targetUrl,
      ownerId: urls.ownerId,
    });
    return urlRecord;
  } catch (error) {
    console.error(error);
  }
}

export async function findUrlsByIdAndUrl(userId, url) {
  try {
    return await dbConnection
      .select()
      .from(urls)
      .where(and(eq(urls.ownerId, userId), eq(urls.targetUrl, url)));
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function findUrlsByUserId(userId) {
  try {
    return await dbConnection.select().from(urls).where(eq(urls.ownerId, userId));
  } catch (error) {
    console.error('Database Error:', error);
  }
}
