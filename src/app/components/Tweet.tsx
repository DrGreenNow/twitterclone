import { AiOutlineRetweet } from 'react-icons/ai';
import { IoShareOutline, IoStatsChart } from 'react-icons/io5';
import { BsChat, BsDot, BsThreeDots } from 'react-icons/bs';
import LikeButton from './LikeButton';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

type TweetType = {
  id: string;
  created_at: string;
  text: string;
  profiles: {
    username: string;
    full_name: string;
  };
};

dayjs.extend(relativeTime);

const ActionIcon = ({ Component }: { Component: React.ComponentType | React.ReactNode }) => (
    <div className="p-3 rounded-full hover:bg-black/10 transition duration-200 cursor-pointer">
      {typeof Component === "function" ? <Component /> : Component}
    </div>
  );

export default function Tweet(tweet: TweetType) {
  return (
    <div key={tweet.id} className="px-4 border-gray-600 flex space-x-4">
      <div>
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-1 w-full">
          <div className="flex w-full">
            <div className="font-bold">{tweet.profiles.full_name ?? ''}</div>
            <div className="text-gray-500">@{tweet.profiles.username}</div>
            <div className="text-gray-500">
              <BsDot />
            </div>
            <div className="text-gray-500">
              {dayjs(tweet.created_at).fromNow()}
            </div>
          </div>
          <div>
            <BsThreeDots />
          </div>
        </div>
        <div className="text-white text-sm">{tweet.text}</div>
        <div className="bg-slate-400 aspect-square w-full h-96 rounded-xl mt-2"></div>
        <div className="flex items-center justify-start space-x-20 mt-2 w-full">
          <ActionIcon Component={BsChat} />
          <ActionIcon Component={AiOutlineRetweet} />
          <ActionIcon Component={<LikeButton tweetId={tweet.id} />} />
          <ActionIcon Component={IoStatsChart} />
          <ActionIcon Component={IoShareOutline} />
        </div>
      </div>
    </div>
  );
}
