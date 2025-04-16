'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { likes, replies } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const likeTweet = async ({
  tweet_id,
  user_id,
}: {
  tweet_id: string;
  user_id: string;
}) => {
  await db
    .insert(likes)
    .values({     id: randomUUID(), tweet_id, user_id })
    .catch((err) => {
      console.log(err);
    });

  revalidatePath('/');
  // TODO put it to global store and check updates in real time withowt refreshing
};

export const unlikeTweet = async ({
  tweet_id,
  user_id,
}: {
  tweet_id: string;
  user_id: string;
}) => {
  await db
    .delete(likes)
    .where(and(eq(likes.tweet_id, tweet_id), eq(likes.user_id, user_id)))
    .catch((err) => {
      console.log(err);
    });

  revalidatePath('/');
};

export const reply = async ({
  tweetId,
  userId,
  replyText,
}: {
  tweetId: string;
  userId: string;
  replyText: string;
}) => {
  if (replyText === '') return;

  await db.insert(replies).values({
    id: randomUUID(),
    text: replyText,
    user_id: userId,
    tweet_id: tweetId,
  });

  revalidatePath(`/tweet/[id]`);
};
