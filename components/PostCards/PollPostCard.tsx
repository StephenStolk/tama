import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";

interface PollPostProps {
  post: {
    _id: string;
    title: string;
    pollOptions: string[];
    author: string;
    slug: string;
    tags: string[];
    createdAt: string;
  };
}

const PollPostCard: React.FC<PollPostProps> = ({ post }) => {
    const [voteType, setVoteType] = useState<"upvote" | "downvote" | null>(null);
        
        const handleVote = async (newVoteType: "upvote" | "downvote") => {
            try {
                if(voteType === newVoteType) {
                    await fetch(`/api/posts/votes?postId=${post._id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    setVoteType(null);
                } else {
                    await fetch("/api/posts/votes", {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        credentials: "include",
                        body: JSON.stringify({
                            postId: post._id, voteType: newVoteType, type: "video" 
                        }),
                    });
                    setVoteType(newVoteType);
                }
            } catch(error: unknown) {
                alert(error);
                console.error("Error handling vote:", error);
            }
        }
  return (
    <Card className="w-full">
      <CardHeader>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{post.author}</p>
        <p className="text-xs text-muted-foreground">{post.createdAt}</p>
      </CardHeader>

      
      <CardContent>
      {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">#{tag}</span>
            ))}
          </div>
        )}
        <h2 className="text-lg font-semibold">{post.title}</h2>

        
        <div className="mt-2">
  {post.pollOptions.map((option, index) => (
    <Button key={index} variant="outline" className="w-full my-1">
      {option.option} ({option.votes} votes)
    </Button>
  ))}
</div>

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

export default PollPostCard;
