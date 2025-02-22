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

        {/* Corrected Tags Rendering */}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">#{tag}</span>
            ))}
          </div>
        )}

        {/* Image */}
        {post.imageUrl && (
          <div className="mt-4">
            <Image
              src={post.imageUrl}
              alt="Post Image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <ArrowBigUp className="h-5 w-5 text-gray-500 hover:text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowBigDown className="h-5 w-5 text-gray-500 hover:text-red-600" />
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <MessageSquare className="h-5 w-5" />
            Comments
          </Button>
          <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <Share className="h-5 w-5" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TextPostCard;
