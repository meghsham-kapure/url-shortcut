import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import platforms from './platform.model.js';
import users from './user.model.js';

export const linkCategoryEnum = pgEnum('link_category', [
  'socials',
  'products',
  'services',
  'merchandise',
  'events',
  'portfolio',
  'publications',
  'referrals',
  'other',
]);

const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  platform: uuid('platform_id').references(() => platforms.id),

  title: varchar('title', { length: 200 }),
  description: text('description'),
  linkCategory: linkCategoryEnum('link_category').notNull(),

  fullUrl: text('full_url'),
  username: varchar('username', { length: 30 }),
  shortcut: varchar('shortcut').unique().notNull(),
  isActive: boolean('is_active').notNull().default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default links;

// Ready for production
