//import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTagContext } from "../clientheaderprovider/page";

export default function SearchBar() {
  //const router = useRouter();
  const { selectedTag, setSelectedTag } = useTagContext(); 
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        if (data.results) {
          setTags(data.results.map((tag: string) => `#${tag}`));
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setTags([]);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setTags([]);
    // router.push(`/?tag=${encodeURIComponent(tag.replace("#", ""))}`);
    setSelectedTag(tag.replace("#", ""));
  };

  const handleClearTag = () => {
    setSelectedTag(null);
    setQuery("");
    setTags([]);
  };
  return (
    <div ref={searchRef} className="relative flex-1 max-w-xl mx-4 hidden md:block">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input type="text" placeholder="Search by tags" className="w-full pl-10" value={query} onChange={handleSearch} />

      {selectedTag && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm">
          <span>{selectedTag}</span>
          <XCircle className="h-5 w-5 text-red-500 cursor-pointer" onClick={handleClearTag} />
        </div>
      )}
      
      {tags.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded-md shadow-lg mt-2">
          {tags.map((tag) => (
            <li key={tag} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleTagClick(tag)}>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}






  // const handleTagClick = (tag: string) => {
  //   setQuery(tag);
  //   setTags([]);
  //   setSelectedTag(tag); // 🔥 Trigger post filtering
  // };