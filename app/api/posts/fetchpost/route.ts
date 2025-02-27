// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongoose";
// import mongoose from "mongoose";

// // Ensure models are registered before querying
// import User from "@/models/user.model";  
// import Post from "@/models/post.model";
// import Image from "@/models/image.model";
// import Video from "@/models/video.model";
// import Poll from "@/models/poll.model";
// import Vote from "@/models/votes.model";

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase(); // Ensure DB connection is established
//     console.log("Connected to DB ✅");

//     // Fetch all posts
//     // const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
//     //   Post.find().populate("author", "username").lean(),
//     //   Image.find().populate("author", "username").lean(),
//     //   Video.find().populate("author", "username").lean(),
//     //   Poll.find().populate("author", "username").lean(),
//     // ]);

//     const textPosts = await Post.find().populate("author").lean();

    
//     if(!textPosts) {
//         console.error("Error fetching posts: textPosts");
//     return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//     }

//     const imagePosts = await Image.find().populate("author").lean();

    
//     if(!imagePosts) {
//         console.error("Error fetching posts: imagePosts");
//     return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//     }
//     const videoPosts = await Video.find().populate("author").lean();

    
//     if(!videoPosts) {
//         console.error("Error fetching posts: videoPosts");
//     return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//     }
//     const pollPosts = await Poll.find().populate("author").lean();

    
//     if(!pollPosts) {
//         console.error("Error fetching posts: pollPosts");
//     return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//     }
    

//     const allPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts];

//     // Fetch votes and aggregate upvotes/downvotes
//     const postIds = allPosts.map((post) => post._id);
//     const votes = await Vote.aggregate([
//       { $match: { postId: { $in: postIds } } },
//       {
//         $group: {
//           _id: "$postId",
//           upvotes: { $sum: { $cond: [{ $eq: ["$voteType", "upvote"] }, 1, 0] } },
//           downvotes: { $sum: { $cond: [{ $eq: ["$voteType", "downvote"] }, 1, 0] } },
//         },
//       },
//     ]);

//     // Creating a voteMap for easy lookup
//     const voteMap: Record<string, number> = votes.reduce((acc, vote) => {
//       acc[vote._id.toString()] = vote.upvotes - vote.downvotes;
//       return acc;
//     }, {} as Record<string, number>);

//     // Standardizing post objects
//     const formattedPosts = allPosts.map((post: any) => ({
//       _id: post._id.toString(),
//       title: post.title,
//       type: post.type || "",
//       content: post.content || "",
//       imageUrl: post.imageUrl || null,
//       videoUrl: post.videoUrl || null,
//       pollOptions: post.pollOptions || null,
//       slug: post.slug,
//       tags: post.tags || [],
//       author: post.author?.username || "Unknown",
//       likes: voteMap[post._id.toString()] || 0, // Number of net upvotes
//     }));

//     return NextResponse.json({ posts: formattedPosts });
//   } catch (error) {
//     console.log("Registered Mongoose Models:", mongoose.modelNames()); // Debugging
//     console.error("Error fetching posts:", error);
//     return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//   }
// }






// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongoose";
// import Post from "@/models/post.model";
// import Image from "@/models/image.model";
// import Video from "@/models/video.model";
// import Poll from "@/models/poll.model";

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase(); // Ensure DB connection

//     console.log("Connection Established");

//     const textPosts = await Post.find().populate("author").lean();
//     const pollPosts = await Poll.find().populate("author").lean();
//     const imagePosts = await Image.find().populate("author").lean();
//     const videoPosts = await Video.find().populate("author").lean();

//     if (!textPosts) {
//         console.error(
//           "Failed to fetch text posts:",
//           textPosts
//         );
//       }
//       if (!imagePosts) {
//         console.error(
//           "Failed to fetch image posts:",
//           imagePosts
//         );
//       }
//       if (!videoPosts) {
//         console.error(
//           "Failed to fetch video posts:",
//           videoPosts
//         );
//       }
//       if (!pollPosts) {
//         console.error(
//           "Failed to fetch poll posts:",
//           pollPosts
//         );
//       }

//     // Fetch all post types separately
//     // const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
//     //   Post.find().populate("author", "username").lean(),
//     //   Image.find().populate("author", "username").lean(),
//     //   Video.find().populate("author", "username").lean(),
//     //   Poll.find().populate("author", "username").lean(),
//     // ]);

//     // Combine all posts into a single array
//     const allPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts];

//     // Sort by creation date (handling missing `createdAt` cases)
//     allPosts.sort((a: any, b: any) => {
//       const dateA = new Date(a.createdAt || 0).getTime();
//       const dateB = new Date(b.createdAt || 0).getTime();
//       return dateB - dateA; // Newest posts first
//     });

//     return NextResponse.json({ posts: allPosts });

//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch posts" },
//       { status: 500 }
//     );
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongoose";
// import Post from "@/models/post.model";
// import Image from "@/models/image.model";
// import Video from "@/models/video.model";
// import Poll from "@/models/poll.model";

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDatabase(); // Ensure DB connection
//     console.log("Database connected.");

//     // Fetch all posts
//     const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
//       Post.find().populate("author").lean(),
//       Image.find().populate("author").lean(),
//       Video.find().populate("author").lean(),
//       Poll.find().populate("author").lean(),
//     ]);

//     const allPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts];

//     // Sort posts by score in descending order (higher score first)
//     allPosts.sort((a, b) => b.score - a.score);

//     return NextResponse.json({ posts: allPosts });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";
import Vote from "@/models/votes.model";
import User from "@/models/user.model"; // Import the User model
import { Types } from "mongoose"; // Import Types from mongoose

const calculateScore = (upvotes: number, views: number, createdAt: Date): number => {
  const ageInDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return upvotes + views * 0.1 - ageInDays * 0.1; // Example scoring formula
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure DB connection
    console.log("Database connected.");

     // Ensure the User model is registered by accessing it here
     const userCheck = await User.findOne();
    console.log("User model check:", userCheck);
    // Fetch all posts
    const [textPosts, imagePosts, videoPosts, pollPosts] = await Promise.all([
      Post.find().populate("author", "username").lean(),
      Image.find().populate("author", "username").lean(),
      Video.find().populate("author", "username").lean(),
      Poll.find().populate("author", "username").lean(),
    ]);

    // Fetch votes
    const votes = await Vote.find().lean();

    const voteCountMap: Record<string, number> = votes.reduce((acc: Record<string, number>, vote) => {
      const postIdStr = vote.postId.toString();
      if (vote.voteType === "upvote") {
        acc[postIdStr] = (acc[postIdStr] || 0) + 1;
      } else if (vote.voteType === "downvote") {
        acc[postIdStr] = (acc[postIdStr] || 0) - 1;
      }
      return acc;
    }, {});

    let allPosts = [...textPosts, ...imagePosts, ...videoPosts, ...pollPosts];

    // Ensure _id is properly typed as Types.ObjectId
    allPosts = allPosts.map(post => ({
        ...post,
        views: post.views ?? 0, // Default views to 0 if not present
        score: calculateScore(voteCountMap[(post._id as Types.ObjectId).toString()] || 0, post.views ?? 0, post.createdAt),
      }));

    // Sort posts by score and createdAt (recent posts first if scores are equal)
    allPosts.sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
