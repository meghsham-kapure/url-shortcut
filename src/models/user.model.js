import { pgTable, text, uuid, varchar, timestamp, date, integer } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar('username', { length: 30 }).notNull().unique(),

  firstName: varchar('first_name', { length: 55 }).notNull(),
  lastName: varchar('last_name', { length: 55 }),
  birthDate: date('birth_date').notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull().unique(),

  password: text('password').notNull(),
  salt: text('salt').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export default users;
