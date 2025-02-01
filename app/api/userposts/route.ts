import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: unknown = jwt.verify(token, process.env.JWT_SECRET!);
    await connectToDatabase();

    const posts = await Post.find({ author: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
  }
}
