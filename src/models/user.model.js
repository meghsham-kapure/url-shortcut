import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  
  username: varchar('username', { length: 30 }).notNull().unique(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull().unique(),

  password: text('password').notNull(),
  salt: text('salt').notNull(),

  isDeactivated: boolean('is_deactivated').default(false).notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default users;

// Ready for production
