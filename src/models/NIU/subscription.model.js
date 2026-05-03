// import {
//   pgTable,
//   timestamp,
//   uuid
// } from 'drizzle-orm/pg-core';
// import { default as plans, default as users } from '../user.model.js';

// const subscriptions = pgTable('subscriptions', {
//   id: uuid().primaryKey().defaultRandom(),
//   userId: uuid().references(() => users.id),
//   planId: uuid().references(() => plans.id),

//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   expiresAt: timestamp('expires_at').notNull(),
//   updatedAt: timestamp('updated_at')
//     .defaultNow()
//     .notNull()
//     .$onUpdate(() => new Date()),
// });
