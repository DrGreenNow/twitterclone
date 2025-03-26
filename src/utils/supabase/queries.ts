'use server';

import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export async function submitTweet(formData: FormData) {
  const supabase = await createClient();

  const tweet = formData.get('tweet');
  if (!tweet) return;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return;

  const { data, error } = await supabase.from('tweets').insert({
    user_id: userData.user.id,
    text: tweet.toString(),
    id: randomUUID(),
  });

  revalidatePath('/');

  return { data, error };
}


export async function getTweets() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('tweets').select(`
        *,
        profiles (
            full_name,
            username
        )
        `);

  return { data, error };
}
