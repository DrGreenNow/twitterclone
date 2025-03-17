import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { IoShareOutline, IoStatsChart } from "react-icons/io5";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";

const MainComponent = () => {
  return (
    <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
    <h1 className="text-xl font-bold p-6 backdrop-blur bg-black/10 sticky top-0">Home</h1>
    <div className="border-t-[0.5px] px-4 border-b-[0.5px] border-gray-600 flex items-stretch py-4 space-x-2 relative">
      <div className="w-11 h-11 bg-slate-400 rounded-full flex-none"></div>
      <div className="flex flex-col w-full h-full">
        <div>
          <input type="text" placeholder="What's happening?" className="w-full h-full placeholder:text-gray-600 bg-transparent outline-none border-none p-4"></input>
        </div>
        <div className="w-full justify-between items-center flex">
          <div>

          </div>
          <div className="w-full max-w-[100px]">
            <button className="w-full rounded-full bg-primary px-4 py-2 text-lg hover:bg-primary/70 transition duration-100 font-bold">
              Tweet
            </button>
          </div>
        </div>
      </div>
      {/* <ComposeTweet /> */}
    </div>
    <div className="flex flex-col">
      {Array.from({length: 5}).map((_,i) => (
        <div key={i} className="px-4 border-gray-600 flex space-x-4">
            <div>
              <div className="w-10 h-10 bg-slate-200 rounded-full"/>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1 w-full">
                <div className="flex w-full">
                  <div className="font-bold">Name</div>
                  <div className="text-gray-500">@username</div>
                  <div className="text-gray-500">
                    <BsDot />
                  </div>
                  <div className="text-gray-500">1 hour ago</div>
                </div>
                <div>
                  <BsThreeDots />
                </div>
              </div>
              <div className="text-white text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, aperiam consequuntur. Sit voluptatum fugiat nobis nesciunt. Voluptates deserunt blanditiis temporibus quia aliquid? Fugiat, iste delectus. Obcaecati maxime optio aut ipsum.
              </div>
              <div className="bg-slate-400 aspect-square w-full h-96 rounded-xl mt-2">

              </div>
              <div className="flex items-center justify-start space-x-20 mt-2 w-full">
                <div className="rounded-full hover:bg-black/10 transition duration-200 p-3 cursor-pointer">
                  <BsChat />
                </div>
                <div className="rounded-full hover:bg-black/10 transition duration-200 p-3 cursor-pointer">
                  <AiOutlineRetweet />
                </div>
                <div className="rounded-full hover:bg-black/10 transition duration-200 p-3 cursor-pointer">
                  <AiOutlineHeart />
                </div>
                <div className="rounded-full hover:bg-black/10 transition duration-200 p-3 cursor-pointer">
                  <IoStatsChart />
                </div>
                <div className="rounded-full hover:bg-black/10 transition duration-200 p-3 cursor-pointer">
                  <IoShareOutline />
                </div>
              </div>
            </div>
        </div>
      ))}
    </div>
  </main>
  )
}

export default MainComponent;