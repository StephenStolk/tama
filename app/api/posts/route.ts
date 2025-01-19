import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newPost = new Post({
      title,
      content,
      author: decoded.userId,
    });

    await newPost.save();

    return NextResponse.json({ message: "Post created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}
