import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import slugify from "slugify";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Handle FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string;
    const pollOptions = formData.get("pollOptions")
      ? JSON.parse(formData.get("pollOptions") as string)
      : [];

    if (!title || (!content && type !== "poll")) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let slug = slugify(title, { lower: true, strict: true });
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Handle media uploads (if applicable)
    const media: string[] = [];
    const mediaFile = formData.get("media") as File;
    if (mediaFile) {
      const buffer = await mediaFile.arrayBuffer();
      const mediaUrl = await uploadToCloudinary(buffer); // Implement this function
      media.push(mediaUrl);
    }

    const newPost = new Post({
      title,
      type,
      content,
      media,
      pollOptions,
      slug,
      author: decoded.userId,
    });

    await newPost.save();

    const postUrl = `/${user.username}/${newPost._id}/${slug}`;

    return NextResponse.json(
      { message: "Post created successfully", postUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}
function uploadToCloudinary(buffer: ArrayBuffer) {
  throw new Error("Function not implemented.");
}

