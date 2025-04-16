'use client';

import React, { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { BsChat, BsDot, BsThreeDots } from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Profile, Tweet } from '@/lib/db/schema';
import { useSupabase } from '@/app/supabase-provider';
import { toast } from 'sonner';
import { reply } from '@/lib/supabase/mutations';

dayjs.extend(relativeTime);

type ReplyDialogProps = {
  tweet: {
    userProfile: Profile;
    tweetDetails: Tweet;
  };
  repliesCount: number;
};

const ReplyDialog = ({ tweet, repliesCount }: ReplyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { supabase } = useSupabase();

  const handleReply = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        toast('Please login to reply to a tweet');
        return;
      }

      startTransition(() => {
        reply({
          replyText,
          tweetId: tweet.tweetDetails.id,
          userId: data.user.id,
        })
          .then(() => setIsOpen(false))
          .catch(() => toast.error('Something went wrong with DB'));
      });
    } catch {
      toast.error('Authentication failed');
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full flex items-center space-x-1 hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
          <BsChat />
          <span>{repliesCount || 0}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-black sm:max-w-2xl border-none text-white">
        <DialogTitle />
        <div className="p-2 flex space-x-4 w-full">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-1">
                <span className="font-bold">
                  {tweet.userProfile.full_name ?? ''}
                </span>
                <span className="text-gray-500">
                  @{tweet.userProfile.username}
                </span>
                <BsDot className="text-gray-500" />
                <span className="text-gray-500">
                  {dayjs(tweet.tweetDetails.created_at).fromNow()}
                </span>
              </div>
              <BsThreeDots />
            </div>
            <p className="text-white text-base my-4">
              {tweet.tweetDetails.text}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Replying to{' '}
          <span className="text-blue-500">@{tweet.userProfile.username}</span>
        </p>
        <div className="flex items-start space-x-2 w-full">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full text-2xl placeholder:text-gray-600 bg-transparent p-4 outline-none resize-none"
            placeholder="Write your reply..."
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            disabled={isPending}
            onClick={handleReply}
            className="rounded-full bg-gray-500 px-3 py-1 text-lg text-black font-bold hover:bg-opacity-70 transition duration-200 w-full max-w-[100px]">
            Reply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
