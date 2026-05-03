import { check, date, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

import users from './user.model.js';

export const salutationEnum = pgEnum('salutation', ['mr', 'ms', 'mrs', 'dr', 'not_specified']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'non_binary', 'not_specified']);

const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('userId').references(() => users.id),

    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }),

    bio: varchar('bio', { length: 200 }),
    about: text('about', { length: 2000 }),

    birthDate: date('birth_date').notNull(),
    gender: genderEnum('gender').default('not_specified').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },

  (table) => [check('age_min_13', sql`${table.birthDate} <= CURRENT_DATE - INTERVAL '13 years'`)]
);

export default profiles;

// Ready for production
