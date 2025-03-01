"use client";
// import { useState } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
import { SidebarWrapper } from "./(main)/sidebar/SidebarWrapper";
import RightbarWrapper from "./(main)/rightbar/page";
// import PostList from "./(main)/postList/page";
import { PostCard } from "@/components/post-card";

export default function Home() {
  // const pathname = usePathname(); // Get current route
  // const searchParams = useSearchParams();
  // const selectedTag = searchParams.get("tag"); // Get tag from URL

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className="flex-1 md:ml-[22%] md:mr-[22%] h-screen overflow-auto p-0 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {/* ✅ Render PostList only on the home page */}
          {/* {pathname === "/" && (
            <PostList selectedTag={selectedTag} clearSelectedTag={() => history.pushState({}, "", "/")} />
          )} */}
          {/* <PostCard /> */}
        </div>
      </div>

      {/* Rightbar */}
      <RightbarWrapper />
    </div>
  );
}
