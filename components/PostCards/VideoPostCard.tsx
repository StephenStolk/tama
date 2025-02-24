import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VideoPostProps {
  post: {
    _id: string;
    title: string;
    videoUrl: string;
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

const VideoPostCard: React.FC<VideoPostProps> = ({ post }) => {
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
          body: JSON.stringify({
            postId: post._id,
            voteType: newVoteType,
            type: "video",
          }),
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
        body: JSON.stringify({ postId: post._id, content: newComment }), // ✅ Fixed key: "content"
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
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{post.author}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString()}
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
        <h2 className="text-lg font-semibold">{post.title}</h2>

        {post.videoUrl ? (
          <video controls className="w-full mt-2 rounded-lg">
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-red-500">Video not available</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant={voteType === "upvote" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleVote("upvote")}
        >
          <ArrowBigUp className="h-5 w-5" />
        </Button>

        <Button
          variant={voteType === "downvote" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleVote("downvote")}
        >
          <ArrowBigDown className="h-5 w-5" />
        </Button>

        <Button variant="ghost" onClick={() => setCommentsOpen(!commentsOpen)}>
          <MessageSquare className="h-5 w-5" /> Comments
        </Button>

        <Button variant="ghost">
          <Share className="h-5 w-5" /> Share
        </Button>
      </CardFooter>

      {commentsOpen && (
        <div className="p-4 border-t">
          {/* ✅ Input field for new comment */}
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

          {/* ✅ Displaying comments */}
          <div className="mt-4 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="p-2 border rounded-lg">
                  <p className="text-sm font-semibold">{comment.author.username}</p>
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

export default VideoPostCard;
