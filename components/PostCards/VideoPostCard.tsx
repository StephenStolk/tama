import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";

interface VideoPostProps {
  post: {
    title: string;
    videoUrl: string;
    author: string;
    slug: string;
    tags: string[];
    createdAt: string;
  };
}

const VideoPostCard: React.FC<VideoPostProps> = ({ post }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{post.author}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString()} {/* ✅ Format date */}
        </p>
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
        {post.videoUrl ? (
          <video controls className="w-full mt-2 rounded-lg">
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-red-500">Video not available</p> /* ✅ Handle missing videos */
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="icon">
          <ArrowBigUp className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <ArrowBigDown className="h-5 w-5" />
        </Button>
        <Button variant="ghost">
          <MessageSquare className="h-5 w-5" /> Comments
        </Button>
        <Button variant="ghost">
          <Share className="h-5 w-5" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoPostCard;
