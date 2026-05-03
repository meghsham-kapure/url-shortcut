import { boolean, pgTable, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import users from './user.model.js';

export const SenOnEnum = pgEnum('sent_on', ['sms', 'whatsapp', 'email', 'phone']);

const verifications = pgTable('verification', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').references(() => users.id),

  otpCode: varchar('otp_code').notNull(),

  sentOn: SenOnEnum('sent_on').notNull().default('sms'),
  isUsed: boolean('is_used').default(false),

  createdAt: timestamp('createdAt').defaultNow().notNull(),
  expiresAt: timestamp('expiresAt')
    .default(sql`now() + interval '15 minutes'`)
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default verifications;
