import { pgTable, text, uuid, varchar, timestamp, date, integer } from 'drizzle-orm/pg-core';

import users from './user.model.js';

const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id),
  refreshToken: varchar('refreshToken', { length: 512 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export default sessions;
