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
// import { HiEnvelope } from "react-icons/hi2";

const NAVIGATION_ITEMS = [
  {
    title: 'Twitter',
    icon: BsTwitter,
  },
  {
    title: 'Home',
    icon: BiHomeCircle,
  },
  {
    title: 'Explore',
    icon: HiOutlineHashtag,
  },
  {
    title: 'Notifications',
    icon: BsBell,
  },
  {
    title: 'Messages',
    icon: BsEnvelope,
  },
  {
    title: 'Bookmarks',
    icon: BsBookmark,
  },
  {
    title: 'Profile',
    icon: BiUser,
  },
];

export default function LeftSidebar() {
  return (
    <section className="w-[23%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden">
      <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            className="hover:bg-white/10 transition duration-200 flex items-center justify-start text-xl w-fit space-x-6 rounded-3xl py-2 px-4"
            href={`/${item.title.toLowerCase}`}
            key={item.title}>
            <div>
              <item.icon />
            </div>
            <div>{item.title !== 'Twitter' && item.title}</div>
          </Link>
        ))}
        <button className="rounded-full bg-primary m-4 p-4 text-2xl hover:bg-primary/70 transition duration-100">
          Tweet
        </button>
      </div>
      <button className="w-full flex items-center space-x-2 rounded-full m-4 bg-transparent p-4 text-2xl hover:bg-white/10 transition duration-100">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-slate-400 w-8 h-8"></div>
          <div className="text-left text-sm">
            <div className="font-semibold">Club of coders</div>
            <div>@username</div>
          </div>
        </div>
        <div>
          <BsThreeDots />
        </div>
      </button>
    </section>
  );
}
