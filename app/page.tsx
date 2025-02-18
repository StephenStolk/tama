import PostCardPage  from "./(main)/post-card/page";
import { SidebarWrapper } from "./(main)/sidebar/SidebarWrapper";
import RightbarWrapper from "./(main)/rightbar/page";
export default function Home() {
  return (
    <div className="flex">
      {/* Sidebar Component */}
      <SidebarWrapper />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[22%] md:mr-[22%] h-screen overflow-auto p-0 mt-12 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:gap-6">
          {/* Posts Section */}
          <PostCardPage />
        </div>
      </div>

      {/* Rightbar for large screens */}
      <RightbarWrapper />
    </div>
  );
}
