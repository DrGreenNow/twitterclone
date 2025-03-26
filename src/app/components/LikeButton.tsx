'use client';

import React, { useTransition } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { createClient } from '@/utils/supabase/client';
import { likeTweet } from '@/utils/supabase/mutations';
import { toast } from 'sonner';

type LikeButtonProps = {
  tweetId: string;
  //   likesCount: number | null;
  //   isUserHasLiked: boolean;
};

const LikeButton = ({
  tweetId,
}: //   likesCount,
//   isUserHasLiked,
LikeButtonProps) => {
  const [isLikePending, startTransition] = useTransition();
  const supabase = createClient();

  const handleLike = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        return toast('Please login to like a tweet');
      }

      startTransition(async () => {
        try {
          const response = await likeTweet({
            tweetId,
            userId: data.user.id,
          });
          console.log(response);
        } catch {
          toast.error('Failed to like the tweet');
        }
      });
    } catch {
      toast.error('Authentication failed');
    }
  };

  return (
    <button
      disabled={isLikePending}
      onClick={handleLike}
    >
      <AiOutlineHeart />
    </button>
  );
};

export default LikeButton;
