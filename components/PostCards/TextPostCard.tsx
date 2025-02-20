import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";
import Image from "next/image";

interface TextPostProps {
  post: {
    title: string;
    content: string;
    imageUrl?: string;
    author: string;
    slug: string;
    tags: string[];
    createdAt: string;
  };
}

const TextPostCard: React.FC<TextPostProps> = ({ post }) => {
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
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-sm mt-2">{post.content}</p>
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt="Post"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto mt-2 rounded-lg"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="icon"><ArrowBigUp className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><ArrowBigDown className="h-5 w-5" /></Button>
        <Button variant="ghost"><MessageSquare className="h-5 w-5" /> Comments</Button>
        <Button variant="ghost"><Share className="h-5 w-5" /> Share</Button>
      </CardFooter>
    </Card>
  );
};

export default TextPostCard;
