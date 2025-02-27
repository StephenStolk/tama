"use client";
import { useEffect, useState } from "react";
import ImagePostCard from "@/components/PostCards/ImagePostCard";
import VideoPostCard from "@/components/PostCards/VideoPostCard";
import TextPostCard from "@/components/PostCards/TextPostCard";
import PollPostCard from "@/components/PostCards/PollPostCard";

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

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/fetchpost");

        if (!res.ok) {
          console.error("Failed to fetch posts:", res.status, res.statusText);
        }

        const { posts } = await res.json();
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="py-20 space-y-6">
      {posts.map((post) => {
        switch (post.type) {
          case "image":
            return (
              <ImagePostCard
                key={post._id}
                post={{ ...post, imageUrl: post.imageUrl || "" }}
              />
            );
          case "video":
            return (
              <VideoPostCard
                key={post._id}
                post={{ ...post, videoUrl: post.videoUrl || "" }}
              />
            );
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
            return (
              <PollPostCard
                key={post._id}
                post={{ ...post, pollOptions: post.pollOptions || [] }}
              />
            );
          default:
            // Handle cases where type is not provided
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
      })}
    </div>
  );
};

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
  

