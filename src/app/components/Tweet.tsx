'use client';

import { AiOutlineRetweet } from 'react-icons/ai';
import { IoShareOutline, IoStatsChart } from 'react-icons/io5';
import { BsDot, BsThreeDots } from 'react-icons/bs';
import LikeButton from './LikeButton';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Profile, Tweet } from '@/lib/db/schema';
import ReplyDialog from './ReplyDialog';
import { likeTweet, unlikeTweet } from '@/lib/supabase/mutations';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type TweetProps = {
  tweet: {
    userProfile: Profile;
    tweetDetails: Tweet;
  };
  currentUserId?: string;
  likesCount: number;
  hasLiked: boolean;
  repliesCount: number;
};

dayjs.extend(relativeTime);

const ActionIcon = ({
  Component,
}: {
  Component: React.ComponentType | React.ReactNode;
}) => (
  <div className="p-2 rounded-full hover:bg-black/10 transition duration-200 cursor-pointer">
    {typeof Component === 'function' ? <Component /> : Component}
  </div>
);

export default function TweetItem({
  tweet,
  hasLiked,
  likesCount,
  repliesCount,
}: TweetProps) {
  const supabase = createClient();

  const handleLike = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return toast('Please login to like a tweet');
    }

    if (hasLiked) {
      await unlikeTweet({
        tweet_id: tweet.tweetDetails.id,
        user_id: data.user.id,
      });
    } else {
      await likeTweet({
        tweet_id: tweet.tweetDetails.id,
        user_id: data.user.id,
      });
    }
  };

  return (
    <>
      <div className="px-4 py-3 border-gray-600 flex gap-4">
        <div>
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center space-x-1 w-full">
            <div className="flex w-full">
              <div className="font-bold">
                {tweet.userProfile.full_name ?? ''}
              </div>
              <div className="text-gray-500">@{tweet.userProfile.username}</div>
              <div className="text-gray-500">
                <BsDot />
              </div>
              <div className="text-gray-500">
                {dayjs(tweet.tweetDetails.created_at).fromNow()}
              </div>
            </div>
            <div className="text-gray-500">
              <BsThreeDots />
            </div>
          </div>
          <div className="text-white text-sm">{tweet.tweetDetails.text}</div>
          <div className="bg-slate-400 aspect-square h-46 rounded-xl mt-2"></div>
          <div className="flex items-center justify-between mt-2 w-full text-gray-500">
            <ReplyDialog tweet={tweet} repliesCount={repliesCount} />
            <ActionIcon Component={AiOutlineRetweet} />
            <LikeButton
              likesCount={likesCount}
              isUserHasLiked={hasLiked}
              handleLike={handleLike}
            />
            <ActionIcon Component={IoStatsChart} />
            <ActionIcon Component={IoShareOutline} />
          </div>
        </div>
      </div>
    </>
  );
}
