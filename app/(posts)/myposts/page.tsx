"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/userposts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          const { message } = await response.json();
          setError(message);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handlePostClick = (slug: string) => {
    router.push(`/posts/${slug}`); // Redirect to the individual post page
  };
  
  

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Posts</h1>
      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg p-4 bg-white shadow cursor-pointer hover:shadow-md"
              onClick={() => handlePostClick(post._id)}
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 line-clamp-3">{post.content}</p>
              <p className="text-sm text-gray-400 mt-2">
                {Intl.DateTimeFormat("en-US").format(new Date(post.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
