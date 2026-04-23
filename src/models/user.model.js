import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),

  firstName: varchar('first_name', { length: 55 }).notNull(),
  lastName: varchar('last_name', { length: 55 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  address: text(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export default users;
