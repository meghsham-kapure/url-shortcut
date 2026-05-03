import {
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';

import users from './user.model.js';

const media = pgTable('media', {
  id: uuid().primaryKey().defaultRandom(),
  
  userId: uuid().references(() => users.id),

  profilePicture: text('profile_picture'),
  coverPicture: text('cover_picture'),
  aboutMeVideo: text('about_me_video'),
  namePronounceAudio: text('name_pronounce_audio'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Ready for production
