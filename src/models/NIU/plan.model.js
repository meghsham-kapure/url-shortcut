// import { boolean, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// const plans = pgTable('plans', {
//   id: uuid().primaryKey().defaultRandom(),

//   identifier: varchar('identifier').notNull().unique(),
//   title: varchar('title').notNull(),
//   validity: integer('validity').notNull(),
//   price: integer('price').notNull(),
//   isActive: boolean('is_active').notNull(),

//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   expiresAt: timestamp('expires_at').notNull(),
//   updatedAt: timestamp('updated_at')
//     .defaultNow()
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export default plans;
