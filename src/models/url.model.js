import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import userTable from './user.model.js';

const url = pgTable('urls', {
  id: uuid().primaryKey().defaultRandom(),

  shortcut: varchar('shortcut', { length: 255 }).notNull().unique(),
  targetUrl: text('target_url').notNull(),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export default url;
