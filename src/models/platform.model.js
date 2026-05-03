import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const platformCategoryEnum = pgEnum('platform_category', [
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

const platforms = pgTable('platforms', {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar('name', { length: 100 }).notNull().unique(),
  platformCategory: platformCategoryEnum('platform_category').notNull().default('other'),

  baseUrl: text('base_url').notNull().unique(),
  iconUrl: text('icon_url').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default platforms;
