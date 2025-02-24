import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface TextPostProps {
  post: {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
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

const TextPostCard: React.FC<TextPostProps> = ({ post }) => {
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
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleVote = async (newVoteType: "upvote" | "downvote") => {
    try {
      if (voteType === newVoteType) {
        await fetch(`/api/posts/votes?postId=${post._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setVoteType(null);
      } else {
        await fetch("/api/posts/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ postId: post._id, voteType: newVoteType, type: "post" }),
        });
        setVoteType(newVoteType);
      }
    } catch (error) {
      alert(error);
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
    <Card className="w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center gap-3 p-4 border-b border-gray-100">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" alt={post.author} />
          <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900">{post.author}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
        <p className="text-sm text-gray-700 mt-2">{post.content}</p>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">#{tag}</span>
            ))}
          </div>
        )}

        {post.imageUrl && (
          <div className="mt-4">
            <Image src={post.imageUrl} alt="Post Image" width={0} height={0} sizes="100vw" className="w-full h-auto rounded-lg" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Button variant={voteType === "upvote" ? "default" : "ghost"} size="icon" onClick={() => handleVote("upvote")}>
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          <Button variant={voteType === "downvote" ? "default" : "ghost"} size="icon" onClick={() => handleVote("downvote")}>
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-gray-900" onClick={() => setCommentsOpen(!commentsOpen)}>
            <MessageSquare className="h-5 w-5" /> Comments
          </Button>
          <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <Share className="h-5 w-5" /> Share
          </Button>
        </div>
      </CardFooter>

      {commentsOpen && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()} className="flex-1" />
            <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>Post</Button>
          </div>
          <div className="mt-4 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-2 border rounded-lg">
                  <p className="text-sm font-semibold">{comment.author.username}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
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

export default TextPostCard;
