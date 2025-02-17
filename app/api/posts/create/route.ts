import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

interface IJwtPayload extends JwtPayload {
  userId: string;
}

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    } catch (error) {
      console.log("JWT Error:", error);
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
    const mediaEntries = formData.getAll("media");

    if (mediaEntries.length > 0) {
      for (const mediaEntry of mediaEntries) {
        if (mediaEntry instanceof File) {
          console.log("Uploading file:", mediaEntry.name);
          const mediaUrl = await uploadToCloudinary(mediaEntry, decoded.userId);
          media.push(mediaUrl);
        } else {
          console.error("Invalid media entry:", mediaEntry);
        }
      }
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
  } catch (error: unknown) {
    console.log(`Error creating post: ${error.message}`);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}

// ✅ Updated Cloudinary Upload Function (Using Streams)
async function uploadToCloudinary(file: File, userId: string): Promise<string> {
  try {
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a readable stream from the Buffer
    const stream = Readable.from(buffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "forum_posts",
          tags: [userId],
          resource_type: "auto", // Automatically detects image/video type
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload media");
  }
}