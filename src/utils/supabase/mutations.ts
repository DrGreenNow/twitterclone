'use server';

import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';

export const likeTweet = async ({
  tweetId,
  userId,
}: {
  tweetId: string;
  userId: string;
}) => {
  const supabase = await createClient();

//   const { data: userData, error: userError } = await supabase.auth.getUser();
//   if (userError) return;

  const { data, error } = await supabase.from('likes').insert({
    id: randomUUID(),
    tweet_id: tweetId,
    user_id: userId,
  });

  revalidatePath('/');

  return { data, error };
};
