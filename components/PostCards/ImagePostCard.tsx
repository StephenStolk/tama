import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share } from "lucide-react";
import { Input } from "../ui/input";

interface ImagePostProps {
  post: {
    _id: string;
    title: string;
    imageUrl: string;
    author: string;
    slug: string;
    tags: string[];
    createdAt: string;
  };
}

interface Comment {
  _id: string;
  author: { username: string };
  content: string;
  createdAt: string;
}

const ImagePostCard: React.FC<ImagePostProps> = ({ post }) => {
  const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (commentsOpen) fetchComments();
  }, [commentsOpen]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/comments?postId=${post._id}`);
      const data = await res.json();
      // Ensure comments is always an array
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]); // Set to empty array on error
    }
  };

  const handleVote = async (newVoteType: "upvote" | "downvote") => {
    try {
      if (voteType === newVoteType) {
        // Remove vote if user clicks the same button again
        await fetch(`/api/posts/votes?postId=${post._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setVoteType(null);
      } else {
        // Update vote if different button is clicked
        await fetch("/api/posts/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            postId: post._id,
            voteType: newVoteType,
            type: "image",
          }),
        });
        setVoteType(newVoteType);
      }
    } catch (error: unknown) {
      alert("An error occurred while processing your vote.");
      console.error("Error handling vote:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post._id, content: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-500">
          Posted by {post.author} • {new Date(post.createdAt).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Image
          src={post.imageUrl}
          alt={post.title}
          layout="responsive"
          width={16}
          height={9}
          className="rounded-lg"
        />
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={voteType === "upvote" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleVote("upvote")}
            aria-label="Upvote"
          >
            <ArrowBigUp className="h-5 w-5" />
          </Button>

          <Button
            variant={voteType === "downvote" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleVote("downvote")}
            aria-label="Downvote"
          >
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            onClick={() => setCommentsOpen(!commentsOpen)}
          >
            <MessageSquare className="h-5 w-5" /> Comments
          </Button>

          <Button variant="ghost" aria-label="Share Post">
            <Share className="h-5 w-5" /> Share
          </Button>
        </div>
      </CardFooter>

      {commentsOpen && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
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

          <div className="mt-4 space-y-3">
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-2 border rounded-lg">
                  <p className="text-sm font-semibold">
                    {comment.author.username}
                  </p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImagePostCard;
