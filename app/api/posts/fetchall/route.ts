import {NextRequest, NextResponse} from "next/server";
import connectToDatabase from "@/lib/mongoose";
//import User from "@/models/user.model";
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";
import mongoose from "mongoose";

//await connectToDatabase();


export async function GET(req: NextRequest) {
    await connectToDatabase();
  
    try {
      const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
        Post.find().populate("author", "username").lean(),
        Image.find().populate("author", "username").lean(),
        Video.find().populate("author", "username").lean(),
        Poll.find().populate("author", "username").lean(),
      ]);
  
      // Standardizing Post Objects
      const formattedPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts].map(
        (post) => ({
          _id: post._id,
          title: post.title,
          type: post.type || "post",
          content: post.content || "",
          imageUrl: post.imageUrl || null,
          videoUrl: post.videoUrl || null,
          pollOptions: post.pollOptions || null,
          slug: post.slug,
          tags: post.tags || [],
          author: post.author?.username || "Unknown",
          createdAt: post.createdAt,
          likes: post.likes || 0,
          views: post.views || 0,
          score:
            (post.likes || 0) * 2 +
            (post.views || 0) * 0.5 +
            (new Date().getTime() - new Date(post.createdAt).getTime()) * -0.0000001,
        })
      );
  
      formattedPosts.sort((a, b) => b.score - a.score);
  
      return NextResponse.json({ posts: formattedPosts });

    } catch (error) {
        console.log("Registered Mongoose Models:", mongoose.modelNames());
      console.error("Error fetching ranked posts:", error);
      return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
    }
  }