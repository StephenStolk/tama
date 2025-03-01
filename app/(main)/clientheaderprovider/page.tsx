// "use client";  
// import { useState, ReactNode } from "react";
// import Header from "../header/page";
// import { usePathname } from "next/navigation";
// import PostList from "../postList/page";
// //import PostList from "../postList/page";
// interface ClientSideProviderProps {
//   children: ReactNode;
// }

// export default function ClientSideProvider({ children }: ClientSideProviderProps) {
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const pathname = usePathname(); 

//   return (
//     <>
//       <Header selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
//       {/* <PostList selectedTag={selectedTag} clearSelectedTag={() => setSelectedTag(null)} /> */}
//       {pathname === "/" && (
//            <PostList selectedTag={selectedTag} clearSelectedTag={() => setSelectedTag(null)} /> 
//           )}
//       {children}
//     </>
//   );
// }



"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "../header/page";
import PostList from "../postList/page";

// Create Context for selectedTag
interface TagContextType {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

// ✅ Custom Hook to use the context
export function useTagContext() {
  const context = useContext(TagContext);
  if (!context) throw new Error("useTagContext must be used within a ClientSideProvider");
  return context;
}

// ✅ Main Provider Component
export default function ClientSideProvider({ children }: { children: ReactNode }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const pathname = usePathname(); // Check the current route

  return (
    <TagContext.Provider value={{ selectedTag, setSelectedTag }}>
      <Header selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      {pathname === "/" && <PostList />} {/* PostList automatically updates via Context */}
      {children}
    </TagContext.Provider>
  );
}
