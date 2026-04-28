import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import userTable from './user.model.js';

const urls = pgTable('urls', {
  id: uuid().primaryKey().defaultRandom(),

  shortcut: varchar('shortcut', { length: 255 }).notNull().unique(),
  targetUrl: text('target_url').notNull(),
  ownerId: uuid('owner_id')
    .references(() => userTable.id)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  expiredAt: timestamp('expired_at')
    .$defaultFn(() => {
      const date = new Date();
      date.setDate(date.getDate() + 180);
      return date;
    })
    .notNull(),

  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export default urls;
