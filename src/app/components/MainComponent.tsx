import ComposeTweet from './ComposeTweet';
import { getTweets, getUserData } from '@/lib/supabase/queries';
import TweetItem from './Tweet';

const MainComponent = async () => {
  const user = await getUserData();
  const data = await getTweets({ currentUserID: user?.id });

  return (
    <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600 max-w-150">
      <div className="flex sticky top-0 backdrop-blur bg-black/10">
        <div className="w-1/2 font-bold flex items-center justify-center cursor-pointer hover:bg-white/10">
          <span className='py-3 border-b-4 border-primary'>For you</span>
        </div>
        <div className="w-1/2 flex items-center justify-center cursor-pointer hover:bg-white/10 text-gray-500">
          <span className='py-3'>Following</span>
        </div>
      </div>
      <div className="border-t-[0.5px] px-4 border-b-[0.5px] border-gray-600 flex items-stretch py-4 space-x-2 relative">
        <div className="w-11 h-11 bg-slate-400 rounded-full flex-none"></div>
        <ComposeTweet />
      </div>
      <div className="flex flex-col">
        {data &&
          data.map(({ likes, tweet, profile, hasLiked, replies }) => (
            <TweetItem
              key={tweet.id}
              tweet={{
                tweetDetails: {
                  ...tweet,
                },
                userProfile: {
                  ...profile,
                },
              }}
              likesCount={likes.length}
              hasLiked={hasLiked}
              repliesCount={replies.length}
            />
          ))}
      </div>
    </main>
  );
};

export default MainComponent;
