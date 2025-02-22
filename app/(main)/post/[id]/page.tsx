"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowBigUp, ArrowBigDown, Share, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Link as LinkIcon } from "lucide-react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
}

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const postUrl = `http://localhost:3000/post/${id}`;

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          fetch(`https://dummyjson.com/posts/${id}`),
          fetch(`https://dummyjson.com/posts/${id}/comments`),
        ]);
        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();
        setPost(postData);
        setComments(commentsData.comments);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center h-full">
        <div className="spinner-border animate-spin w-12 h-12 border-t-4 border-black border-solid rounded-full"></div>
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: postUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto md:pl-48 lg:pl-80 px-4 py-20">
      <Card className="w-full mb-8">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar>
            {/* <AvatarImage
              src={`/placeholder-user-${post.userId}.jpg`}
              alt="User"
            /> */}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium sm:text-base">
              u/username{post.userId}
            </p>
            {/* <p className="text-xs text-muted-foreground">Posted 2 hours ago</p> */}
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">{post.title}</h2>
          <p className="text-sm md:text-base mb-4">{post.body}</p>
          <div className="flex flex-wrap mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 md:text-sm text-xs font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
        {/* <CardFooter className="flex justify-between">
          <div className="flex items-center -space-x-1">
            <Button variant="ghost" size="icon">
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span className="text-sm">{post.reactions.likes}</span>
            <Button variant="ghost" size="icon">
              <ArrowBigDown className="h-5 w-5" />
            </Button>
            <span className="text-sm">{post.reactions.dislikes}</span>
          </div>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Share className="h-5 w-5" />
            <span className="text-sm">Share</span>
          </Button>
        </CardFooter> */}
        <CardFooter className="flex justify-between">
          <div className="flex items-center -space-x-1">
            <Button variant="ghost" size="icon">
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span className="text-sm">{post.reactions.likes}</span>
            <Button variant="ghost" size="icon">
              <ArrowBigDown className="h-5 w-5" />
            </Button>
            <span className="text-sm">{post.reactions.dislikes}</span>
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
      </Card>

      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {comments.map((comment) => (
        <Card key={comment.id} className="w-full mb-4">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="w-5 h-5">
              {/* <AvatarImage src={`/placeholder-user-${comment.user.id}.jpg`} alt="User" /> */}
              <AvatarFallback className="text-sm">U</AvatarFallback>
            </Avatar>
            <div>
              <p className="-mt-1.5 -ml-2 text-sm font-medium">
                {comment.user.username}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm ps-1">{comment.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
