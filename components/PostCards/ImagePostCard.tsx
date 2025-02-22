import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share } from "lucide-react";

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

const ImagePostCard: React.FC<ImagePostProps> = ({ post }) => {
  const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(null);

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
            type: "image",
          }),
        });
        setVoteType(newVoteType);
      }
    } catch (error: unknown) {
      alert(error);
      console.error("Error handling vote:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-500">Posted by {post.author} • {new Date(post.createdAt).toLocaleString()}</p>
      </CardHeader>
      <CardContent>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">#{tag}</span>
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
        <Button variant={voteType === "upvote" ? "default" : "ghost"} size="icon" onClick={() => handleVote("upvote")}>
          <ArrowBigUp className="h-5 w-5" />
        </Button>
        <Button variant={voteType === "downvote" ? "default" : "ghost"} size="icon" onClick={() => handleVote("downvote")}>
          <ArrowBigDown className="h-5 w-5" />
        </Button>
        <Button variant="ghost"><MessageSquare className="h-5 w-5" /> Comments</Button>
        <Button variant="ghost"><Share className="h-5 w-5" /> Share</Button>
      </CardFooter>
    </Card>
  );
};

export default ImagePostCard;