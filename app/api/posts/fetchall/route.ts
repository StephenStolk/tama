import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Ensure models are registered before querying
import User from "@/models/user.model";  
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";
import Vote from "@/models/votes.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure DB connection is established
    console.log("Connected to DB ✅");

    // Fetch all posts
    const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
      Post.find().populate("author", "username").lean(),
      Image.find().populate("author", "username").lean(),
      Video.find().populate("author", "username").lean(),
      Poll.find().populate("author", "username").lean(),
    ]);

    const allPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts];

    // Fetch votes and aggregate upvotes/downvotes
    const postIds = allPosts.map((post) => post._id);
    const votes = await Vote.aggregate([
      { $match: { postId: { $in: postIds } } },
      {
        $group: {
          _id: "$postId",
          upvotes: { $sum: { $cond: [{ $eq: ["$voteType", "upvote"] }, 1, 0] } },
          downvotes: { $sum: { $cond: [{ $eq: ["$voteType", "downvote"] }, 1, 0] } },
        },
      },
    ]);

    // Creating a voteMap for easy lookup
    const voteMap: Record<string, number> = votes.reduce((acc, vote) => {
      acc[vote._id.toString()] = vote.upvotes - vote.downvotes;
      return acc;
    }, {} as Record<string, number>);

    // Standardizing post objects
    const formattedPosts = allPosts.map((post: any) => ({
      _id: post._id.toString(),
      title: post.title,
      type: post.type || "",
      content: post.content || "",
      imageUrl: post.imageUrl || null,
      videoUrl: post.videoUrl || null,
      pollOptions: post.pollOptions || null,
      slug: post.slug,
      tags: post.tags || [],
      author: post.author?.username || "Unknown",
      likes: voteMap[post._id.toString()] || 0, // Number of net upvotes
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.log("Registered Mongoose Models:", mongoose.modelNames()); // Debugging
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
  }
}

