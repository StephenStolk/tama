"use client";
import {useEffect, useState } from "react";
import ImagePostCard from "@/components/PostCards/ImagePostCard";
import VideoPostCard from "@/components/PostCards/VideoPostCard";
import TextPostCard from "@/components/PostCards/TextPostCard";
import PollPostCard from "@/components/PostCards/PollPostCard";
import { useTagContext } from "../clientheaderprovider/page";
import Image from "next/image";
// import { useSearchParams } from "next/navigation";

interface Post {
  slug: string;
  tags: string[];
  _id: string;
  title: string;
  type: "image" | "video" | "post" | "poll";
  createdAt: string;
  imageUrl?: string;
  videoUrl?: string;
  content?: string;
  pollOptions?: { option: string; votes: number }[];
  author: { username: string };
  score: number;
}

interface Ad {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  link: string;
  isAd?: boolean;
}

type PostOrAd = Post | Ad;

// interface PostListProps {
//   selectedTag: string | null;
//   clearSelectedTag: () => void;
// }

const PostList = () => {
  const { selectedTag, setSelectedTag } = useTagContext(); 
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let postUrl = "/api/posts/fetchpost"; // Default: Fetch all posts
        if (selectedTag) {
          postUrl = `/api/search?tag=${encodeURIComponent(selectedTag)}`; // Fetch posts by tag
        }

        const [postRes, adRes] = await Promise.all([
          fetch(postUrl),
          fetch("/api/ads"),
        ]);

        console.log("Fetching from:", postUrl);
        
        if (!postRes.ok) throw new Error(`Failed to fetch posts: ${postRes.status}`);
        if (!adRes.ok) throw new Error(`Failed to fetch ads: ${adRes.status}`);


        // const data = await res.json();
        // const adData = await adRes.json();

        const { posts: fetchedPosts } = await postRes.json();
        const { ads: fetchedAds } = await adRes.json();

        console.log("API Response:", postRes);
        const combinedList = [...fetchedPosts];
        // setPosts(data.posts ?? []);

        if (fetchedAds && fetchedAds.length > 0) {
          fetchedAds.forEach((ad: Ad, index: number) => {
            const insertIndex = Math.min(index * 3 + 2, combinedList.length);
            combinedList.splice(insertIndex, 0, { ...ad, isAd: true });
          });
        }

        setPosts(combinedList);
        // setAds(adData.ads);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTag]);
  



  if (loading) return <p>Loading posts...</p>;

  const isAd = (post: Post | Ad): post is Ad => "isAd" in post && post.isAd === true;



  return (
      <div className="flex-1 md:ml-[30%] lg:ml-[22%] lg:mr-[22%] md:mr-[8%] h-screen overflow-auto p-0 no-scrollbar mt-20 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      {selectedTag && (
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg mb-2">
          <p className="text-gray-700">Showing results for: <span className="font-semibold">{selectedTag}</span></p>
          <button onClick={() => setSelectedTag(null)} className="text-red-500 hover:underline">
            Clear
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => {

          if (isAd(post)) {
            return (
              <div key={post._id} className="border p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm">Sponsored</p>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm">{post.content}</p>
                {post.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.imageUrl}
                      alt="Ad"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Learn More
        </a>
              </div>
            );
          }


          switch (post.type) {
            case "image":
              return <ImagePostCard key={post._id} post={{ ...post, imageUrl: post.imageUrl || "" }} />;
            case "video":
              return <VideoPostCard key={post._id} post={{ ...post, videoUrl: post.videoUrl || "" }} />;
            case "post":
              return (
                <TextPostCard
                  key={post._id}
                  post={{
                    ...post,
                    content: post.content ?? "",
                    slug: post.slug ?? "",
                    tags: post.tags ?? [],
                  }}
                />
              );
            case "poll":
              return <PollPostCard key={post._id} post={{ ...post, pollOptions: post.pollOptions || [] }} />;
            default:
              return (
                <TextPostCard
                  key={post._id}
                  post={{
                    ...post,
                    content: post.content ?? "",
                    slug: post.slug ?? "",
                    tags: post.tags ?? [],
                  }}
                />
              );
          }
        })
      )}
    </div>
    </div>
    
  );

}

export default PostList;










// useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch("/api/posts/fetchpost");
  
//         if (!response.ok) {
//           console.error("Failed to fetch posts:", response.status, response.statusText);
//           return;
//         }
  
//         const data = await response.json();
//         setPosts(data.posts); 
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchPosts();
//   }, []);
  


    // useEffect(() => {
    //     posts.forEach((post) => {
    //       trackView(post._id, post.type);
    //     });
    //   }, [posts]); 










    //   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch("/api/posts/fetchpost");
  
//         if (!response.ok) {
//           throw new Error(`Failed to fetch posts: ${response.statusText}`);
//         }
  
//         const data = await response.json();
//         if (!data.posts || !Array.isArray(data.posts)) {
//           throw new Error("Invalid data format received from API");
//         }
  
//         // Ensure sorting by `createdAt`
//         const sortedPosts = data.posts.sort((a: { createdAt: Date; }, b: { createdAt: Date; }) => {
//           const dateA = new Date(a.createdAt || 0).getTime();
//           const dateB = new Date(b.createdAt || 0).getTime();
//           return dateB - dateA; // Newest posts first
//         });
  
//         setPosts(sortedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchPosts();
//   }, []);
  

