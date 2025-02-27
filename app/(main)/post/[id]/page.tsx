"use client";

import React from "react";

import { useEffect, useState } from "react";
import { use } from "react"; // Import React.use
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigUp, ArrowBigDown, Share, Copy, LinkIcon } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Post {
  _id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  pollOptions?: Array<{ option: string; votes: number }>;
  author: string;
  type: "image" | "video" | "post" | "poll";
  tags: string[] | string;
  createdAt: string;
}

interface Comment {
  _id: string;
  author: { username: string };
  content: string;
  createdAt: string;
}

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);

  const defaultAvatar = "https://api.dicebear.com/7.x/avatars/svg";

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);

        const commentsRes = await fetch(`/api/posts/comments?postId=${id}`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData.comments || []);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!post) return;

      try {
        const result = await fetch(`/api/posts/votes?postId=${post._id}`);
        const data = await result.json();

        if (result.ok) {
          setUpvotes(data.upvotes || 0);
          setDownvotes(data.downvotes || 0);
        }
      } catch (error) {
        console.error("Failed to fetch votes:", error);
      }
    };

    fetchVotes();
  }, [post]);

  const parseTags = (tags: string[] | string) => {
    if (Array.isArray(tags)) {
      if (tags.length === 1 && typeof tags[0] === "string") {
        try {
          const tagString = tags[0].replace(/\\/g, ""); // Remove backslashes
          const tagsArray = JSON.parse(tagString);
          return tagsArray;
        } catch (error) {
          console.error("Error parsing tags:", error);
          return [];
        }
      }
      return tags;
    }

    if (typeof tags === "string") {
      const cleanedTags = tags
        .replace(/^#\[/, "") // Remove leading #[
        .replace(/\]$/, "") // Remove trailing ]
        .replace(/['"]/g, ""); // Remove quotes

      const tagsArray = cleanedTags.split(",").map((tag) => tag.trim());
      return tagsArray;
    }

    return [];
  };

  const handleVote = async (newVoteType: "upvote" | "downvote") => {
    if (!post) return;

    try {
      if (voteType === newVoteType) {
        await fetch(`/api/posts/votes?postId=${post._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setVoteType(null);

        if (newVoteType === "upvote") setUpvotes((prev) => prev - 1);
        else setDownvotes((prev) => prev - 1);
      } else {
        const res = await fetch("/api/posts/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            postId: post._id,
            voteType: newVoteType,
            type: post.type,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to vote");
        }

        setVoteType(newVoteType);

        if (newVoteType === "upvote") {
          setUpvotes((prev) => prev + 1);
          if (voteType === "downvote") setDownvotes((prev) => prev - 1);
        } else {
          setDownvotes((prev) => prev + 1);
          if (voteType === "upvote") setUpvotes((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error handling vote:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return;

    try {
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          postId: post._id,
          content: newComment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title || "Check this out",
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  if (!post)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Post not found
      </div>
    );

  const parsedTags = post.tags ? parseTags(post.tags) : [];

  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };
  console.log(post.content);
  return (
    <div className="w-full  mx-auto md:pl-80 py-20">
      <Card className="w-full border p-2 md:p-4 border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-4 border-b border-gray-100">
          <Avatar className="h-10 w-10">
            <AvatarImage src={defaultAvatar} alt={post?.author || "User"} />
            <AvatarFallback>
              {typeof post.author === "string" && post.author.length > 0
                ? post.author.charAt(0).toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900">{post.author}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {post.content && (
            <div className="text-gray-700 mb-4">
              {renderContent(post.content)}
            </div>
          )}

          {post.imageUrl && (
            <div className="mb-4">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          )}

          {post.type === "video" && post.videoUrl && (
            <div className="mb-4">
              <video controls className="w-full rounded-lg">
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {post.type === "poll" && post.pollOptions && (
            <div className="space-y-2 mb-4">
              {post.pollOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border p-2 rounded-md"
                >
                  <span>{option.option}</span>
                  <span>{option.votes} votes</span>
                </div>
              ))}
            </div>
          )}

          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {parsedTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between items-center p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              variant={voteType === "upvote" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleVote("upvote")}
              className="w-14"
            >
              <ArrowBigUp className="h-5 w-5" />
              <span className="ml-1 text-sm">{upvotes}</span>
            </Button>
            <Button
              variant={voteType === "downvote" ? "default" : "ghost"}
              size="icon"
              onClick={() => handleVote("downvote")}
              className="w-14"
            >
              <ArrowBigDown className="h-5 w-5" />
              <span className="ml-1 text-sm">{downvotes}</span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Share className="h-5 w-5" />
                <span className="text-sm">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleShare}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Share via Apps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {copied && (
            <span className="text-xs text-green-500">Link copied!</span>
          )}
        </CardFooter>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
              className="flex-1"
            />
            <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
              Post
            </Button>
          </div>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="md:h-10 h-6 w-6 md:w-10">
                      <AvatarImage
                        src={defaultAvatar}
                        alt={comment.author.username}
                      />
                      <AvatarFallback>
                        {comment.author?.username
                          ? comment.author.username.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">
                        {comment.author.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-8 md:ml-12">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
