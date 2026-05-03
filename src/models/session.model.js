import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import users from './user.model.js';

const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),

  userId: uuid().references(() => users.id),

  refreshToken: varchar('refresh_token', { length: 512 }).notNull().unique(),
  deviceLabel: varchar('device_label', { length: 512 }).unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default sessions;
