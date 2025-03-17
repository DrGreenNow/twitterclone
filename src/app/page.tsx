
import LeftSidebar from "./components/LeftSidebar";
import MainComponent from "./components/MainComponent";
import RightSection from "./components/RightSection";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black text-white">
        <div className="max-w-screen-xl w-full h-full flex relative"> {/* TODO */}
          <LeftSidebar />
          <MainComponent />
          <RightSection />
        </div>
    </div>

  );
}
