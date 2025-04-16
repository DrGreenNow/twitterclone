import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  uuid,
  AnyPgColumn,
  uniqueIndex,
  boolean,
  alias,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  username: text('username').notNull(),
  full_name: text('full_name').notNull(),
  // avatarUrl: text("avatar_url"),
});

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export const profilesRelations = relations(profiles, ({ many }) => ({
  tweets: many(tweets),
  likes: many(likes),
  bookmarks: many(bookmarks),
  replies: many(replies),
}));

export const tweets = pgTable('tweets', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => profiles.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  isReply: boolean('is_reply').notNull().default(false),
  reply_id: uuid('reply_id').references((): AnyPgColumn => tweets.id),
});

export type Tweet = InferSelectModel<typeof tweets>;
export type NewTweet = InferInsertModel<typeof tweets>;

export const tweetsReplies = alias(tweets, 'tweets_replies');

export const tweetsRelations = relations(tweets, ({ one }) => ({
  profile: one(profiles, {
    fields: [tweets.user_id],
    references: [profiles.id],
  }),
  tweet: one(tweets, {
    fields: [tweets.reply_id],
    references: [tweets.id],
  }),
}));

export const hashtags = pgTable('hashtags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

export const tweetHashtag = pgTable(
  'tweet_hashtag',
  {
    tweet_id: uuid('tweet_id')
      .notNull()
      .references(() => tweets.id),
    hashtag_id: uuid('hashtag_id')
      .notNull()
      .references(() => hashtags.id),
  },
  (tweet_hashtag) => [
    primaryKey({
      columns: [tweet_hashtag.tweet_id, tweet_hashtag.hashtag_id],
    }),
  ]
);

export const replies = pgTable('replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => profiles.id),
  tweet_id: uuid('tweet_id').references(() => tweets.id),
  reply_id: uuid('reply_id').references((): AnyPgColumn => replies.id), // self reference
});

export const repliesRelations = relations(replies, ({ one }) => ({
  profile: one(profiles, {
    fields: [replies.user_id],
    references: [profiles.id],
  }),
}));

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => profiles.id),
    tweet_id: uuid('tweet_id')
      .notNull()
      .references(() => tweets.id),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (likes) => [
    uniqueIndex('likes__user_id_tweet_id__idx').on(
      likes.user_id,
      likes.tweet_id
    ),
  ]
);

export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;

export const likesRelations = relations(likes, ({ one }) => ({
  profile: one(profiles, {
    fields: [likes.user_id],
    references: [profiles.id],
  }),
}));

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => profiles.id)
      .notNull(),
    tweet_id: uuid('tweet_id')
      .references(() => tweets.id)
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (bookmarks) => [
    uniqueIndex('bookmarks__user_id_tweet_id__idx').on(
      bookmarks.user_id,
      bookmarks.tweet_id
    ),
  ]
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  profile: one(profiles, {
    fields: [bookmarks.user_id],
    references: [profiles.id],
  }),
}));
