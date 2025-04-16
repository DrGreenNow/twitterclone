'use server';

import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import {
  Like,
  Profile,
  Tweet,
  likes,
  profiles,
  tweets,
  tweetsReplies,
} from '../db/schema';
import { and, eq, exists, desc } from 'drizzle-orm';

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error('Failed to retrieve user');
  return data.user;
}

export async function getUserData() {
  try {
    return await getAuthenticatedUser();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function submitTweet(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();
    const tweetText = formData.get('tweet');
    if (!tweetText) throw new Error('Tweet content is required');

    const tweet = await db
      .insert(tweets)
      .values({
        text: tweetText.toString(),
        id: randomUUID(),
        user_id: user.id,
      })
      .returning();

    revalidatePath('/');
    return tweet;
  } catch (error) {
    console.error(error);
  }
}

export const getTweets = async ({
  currentUserID,
  // getSingleTweetId,
  // limit,
  replyId,
  // profileUsername,
}: {
  currentUserID?: string;
  getSingleTweetId?: string;
  orderBy?: boolean;
  limit?: number;
  replyId?: string;
  profileUsername?: string;
}) => {
  try {
    const query = db
      .select({
        tweets,
        profiles,
        ...(currentUserID
          ? {
              hasLiked: exists(
                db
                  .select()
                  .from(likes)
                  .where(
                    and(
                      eq(likes.tweet_id, tweets.id),
                      eq(likes.user_id, currentUserID)
                    )
                  )
              ),
            }
          : {}),
        likes,
        tweetsReplies,
      })
      .from(tweets)
      .where(eq(tweets.isReply, Boolean(replyId)))
      .leftJoin(likes, eq(tweets.id, likes.tweet_id))
      .leftJoin(tweetsReplies, eq(tweets.id, tweetsReplies.reply_id))
      .innerJoin(profiles, eq(tweets.user_id, profiles.id))
      .orderBy(desc(tweets.created_at));

    // if (getSingleTweetId) {
    //   query = query.where(eq(tweets.id, getSingleTweetId));
    // }

    // if (limit) {
    //   query = query.limit(limit);
    // }

    // if (replyId) {
    //   query = query.where(eq(tweets.reply_id, replyId));
    // }

    // if (profileUsername) {
    //   query = query.where(
    //     and(eq(profiles.username, profileUsername), eq(tweets.isReply, false))
    //   );
    // }

    const rows = await query;

    if (rows) {
      const result = rows.reduce<
        Record<
          string,
          {
            tweet: Tweet;
            likes: Like[];
            profile: Profile;
            hasLiked: boolean;
            replies: Tweet[];
          }
        >
      >((acc, row) => {
        const tweet = row.tweets;
        const like = row.likes;
        const profile = row.profiles;
        const hasLiked = Boolean(row.hasLiked);
        const reply = row.tweetsReplies;

        if (!acc[tweet.id]) {
          acc[tweet.id] = {
            tweet,
            likes: [],
            profile,
            hasLiked,
            replies: [],
          };
        }

        if (like) {
          acc[tweet.id].likes.push(like);
          const ids = acc[tweet.id].likes.map(({ id }) => id);
          const filteredLikesArr = acc[tweet.id].likes.filter(
            ({ id }, index) => !ids.includes(id, index + 1)
          );
          acc[tweet.id].likes = filteredLikesArr;
        }

        if (reply) {
          acc[tweet.id].replies.push(reply);
          const ids = acc[tweet.id].replies.map(({ id }) => id);
          const filteredRepliesArr = acc[tweet.id].replies.filter(
            ({ id }, index) => !ids.includes(id, index + 1)
          );
          acc[tweet.id].replies = filteredRepliesArr;
        }

        return acc;
      }, {});

      const data = Object.values(result);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export async function getLikesCount(tweetId: string) {
  try {
    const supabase = await createClient();
    return await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('tweet_id', tweetId);
  } catch (error) {
    console.error(error);
  }
}

export const isLiked = async ({
  tweetId,
  userId,
}: {
  tweetId: string;
  userId: string;
}) => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('tweet_id', tweetId)
      .eq('user_id', userId)
      .single();
    return Boolean(data?.id);
  } catch (error) {
    console.error(error);
  }
};
