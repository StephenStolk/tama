import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import { Comment } from "@/models/comments.model";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/user.model";

await connectToDatabase();

interface IJwtPayload extends JwtPayload {
    userId: string;
}


// ✅ Add a Comment
export async function POST(req: NextRequest) {
    try {
      const token = (await cookies()).get("token")?.value;

      if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
      let decoded: IJwtPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
      } catch (error: unknown) {
        console.log(error);
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
      }
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const { postId, content } = await req.json();

      if (!postId || !content) {
        return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
      }
  
      const newComment = await Comment.create({
        author: decoded.userId,
        postId,
        content,
      });
  
      return NextResponse.json({ message: "Comment added", comment: newComment }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
  }

  export async function GET(req: NextRequest) {
    try {
        const { searchParams} = new URL(req.url);
        const postId = searchParams.get("postId");

        if(!postId) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        const comments = await Comment.find({ postId}).populate("author","username");

        return NextResponse.json({ comments }, { status: 200 });

    } catch (error: unknown){
        console.error(error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
  }