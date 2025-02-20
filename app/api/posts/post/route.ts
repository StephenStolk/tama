import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import User from "@/models/user.model";

interface IJwtPayload extends JwtPayload {
  userId: string;
}

// ✅ CREATE A NEW POST
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    } catch (error: unknown) {
        console.log(error);
        alert(error);
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Handle FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;
    const tags = formData.getAll("tags") as string[];

    if (!title || !content) return NextResponse.json({ message: "Title and content are required" }, { status: 400 });

    if(tags.length >2) {
        return NextResponse.json({
            message: "You can put upto 2 tags only."
        }, { status: 400}
        );
    }

    let securedUrl = null;

    // ✅ If an image is provided, upload to Cloudinary
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "next-cloudinary-images", tags: [decoded.userId] },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(buffer);
        });
        securedUrl = result.secure_url;
      } catch (error) {
        return NextResponse.json({ message: "Image upload failed", error }, { status: 500 });
      }
    }

    let slug = slugify(title, { lower: true, strict: true });
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
          slug = `${slug}-${Date.now()}`;
        }

    const newPost = new Post({
      title,
      content,
      imageUrl: securedUrl,
      slug,
      author: decoded.userId,
      tags,
    });

    await newPost.save();

    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}





// export async function GET(request: NextRequest) {
//     try {
//       await connectToDatabase();
  
//       const { searchParams } = new URL(request.url);
//       const tag = searchParams.get("tags");
  
//       const query: Record<string, any> = {};
//       if (tag) {
//         query.tags = { $in: [tag] };
//       }
  
//       const posts = await Post.find(query)
//         .populate("author", "username")
//         .sort({ createdAt: -1 });
  
//       if (!posts.length) {
//         console.warn("No posts found.");
//         return NextResponse.json([], { status: 200 }); // Return empty array instead of 404
//       }
  
//       const postResponse = posts.map((post) => ({
//         title: post.title,
//         content: post.content,
//         imageUrl: post.imageUrl,
//         slug: post.slug,
//         author: post.author.username,
//         createdAt: post.createdAt,
//         tags: post.tags,
//       }));
  
//       return NextResponse.json(postResponse, { status: 200 });
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
//     }
//   }
  



export async function GET(request: NextRequest) {
    try {
      await connectToDatabase();
  
      const posts = await Post.find().populate("author","username");
  
      if(posts.length === 0) {
        return NextResponse.json({
          message: "No Post found"
        }, { status: 404});
      }
      const postResponse = posts.map((post) => ({
        _id: post._id,
        title: post.title,
        type: "post", // ✅ Add this to match frontend expectation
        imageUrl: post.imageUrl,
        slug: post.slug,
        author: post.author.username, // ✅ Include author username
        createdAt: post.createdAt,
      }));
    
        return NextResponse.json(postResponse, { status: 200 });
    } catch (error: unknown) {
      console.log(`Error fetching images: ${error}`);
      return NextResponse.json({ message: "Error fetching images" }, { status: 500 });
    }
  }



//   also, i am getting this warning:
// Property 'option' does not exist on type 'string'.ts(2339)
// Property 'votes' does not exist on type 'string'.ts(2339)


// import React from "react";
// import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ArrowBigUp, ArrowBigDown, Share, MessageSquare } from "lucide-react";

// interface PollPostProps {
//   post: {
//     title: string;
//     pollOptions: string[];
//     author: string;
//     createdAt: string;
//   };
// }

// const PollPostCard: React.FC<PollPostProps> = ({ post }) => {
//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <Avatar>
//           <AvatarImage src="/placeholder-user.jpg" alt="User" />
//           <AvatarFallback>U</AvatarFallback>
//         </Avatar>
//         <p className="text-sm font-medium">{post.author}</p>
//         <p className="text-xs text-muted-foreground">{post.createdAt}</p>
//       </CardHeader>
//       <CardContent>
//         <h2 className="text-lg font-semibold">{post.title}</h2>
//         <div className="mt-2">
//   {post.pollOptions.map((option, index) => (
//     <Button key={index} variant="outline" className="w-full my-1">
//       {option.option} ({option.votes} votes)
//     </Button>
//   ))}
// </div>

//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button variant="ghost" size="icon"><ArrowBigUp className="h-5 w-5" /></Button>
//         <Button variant="ghost" size="icon"><ArrowBigDown className="h-5 w-5" /></Button>
//         <Button variant="ghost"><MessageSquare className="h-5 w-5" /> Comments</Button>
//         <Button variant="ghost"><Share className="h-5 w-5" /> Share</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PollPostCard;