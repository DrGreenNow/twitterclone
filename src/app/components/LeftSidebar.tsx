import Link from 'next/link';
import { BiHomeCircle, BiUser } from 'react-icons/bi';
import {
  BsBell,
  BsBookmark,
  BsTwitter,
  BsEnvelope,
  BsThreeDots,
} from 'react-icons/bs';
import { HiOutlineHashtag } from 'react-icons/hi';
import { getUserData } from '@/lib/supabase/queries';

const NAVIGATION_ITEMS = [
  { title: 'Twitter', icon: BsTwitter },
  { title: 'Home', icon: BiHomeCircle },
  { title: 'Explore', icon: HiOutlineHashtag },
  { title: 'Notifications', icon: BsBell },
  { title: 'Messages', icon: BsEnvelope },
  { title: 'Bookmarks', icon: BsBookmark },
  { title: 'Profile', icon: BiUser },
];

const getNavLink = (title: string, username?: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle === 'home') return '/';
  if (lowerTitle === 'profile') return `/${username || '#'}`;
  return `/${lowerTitle}`;
};

const LeftSidebar = async () => {
  const data = await getUserData();
  const username = data?.user_metadata?.username;

  return (
    <section className="w-65 sticky top-0 xl:flex flex-col items-stretch h-screen hidden">
      <div className="flex flex-col items-stretch justify-between h-full mt-4">
        <div className="flex flex-col space-y-4">
          {NAVIGATION_ITEMS.map(({ title, icon: Icon }) => (
            <Link
              key={title}
              href={getNavLink(title, username)}
              className="hover:bg-white/10 transition duration-200 flex items-center justify-start text-xl w-fit space-x-6 rounded-3xl py-2 px-4">
              <div>
                <Icon />
              </div>
              {title !== 'Twitter' && <div>{title}</div>}
            </Link>
          ))}

          <button className="rounded-full bg-white m-4 p-2.5 text-xl hover:bg-white/90 transition duration-100 text-black">
            Post
          </button>
        </div>
        <button className="w-full flex items-center justify-between my-4 bg-transparent p-4 text-2xl hover:bg-white/10 transition duration-100">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-slate-400 w-8 h-8" />
            <div className="text-left text-sm">
              <div className="font-bold">Club of coders</div>
              <div className='text-gray-500'>@username</div>
            </div>
          </div>
          <BsThreeDots />
        </button>
      </div>
    </section>
  );
};

export default LeftSidebar;
