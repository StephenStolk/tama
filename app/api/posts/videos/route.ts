import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model";
import Video from "@/models/video.model";
import { cookies } from "next/headers";

interface IJwtPayload extends JwtPayload {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      console.log("Unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    } catch (error) {
      console.log("JWT Error:", error);
      return NextResponse.json({
        message: "Invalid or expired token"
      }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const file = formData.get("file") as File | null;
    const tags = formData.getAll("tags") as string[];

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    if (type !== "video") {
      return NextResponse.json({ message: "Video is not defined" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let slug = slugify(title, { lower: true, strict: true });
    const existingVideo = await Video.findOne({ slug });
    if (existingVideo) {
      slug = `${slug}-${Date.now()}`;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "next-cloudinary-videos", resource_type: "video", tags: [decoded.userId] },
        (error, result) => {
          if (error) {
            return reject(error);
          } else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const newVideo = new Video({
      title,
      type,
      videoUrl: result.secure_url,
      slug,
      author: decoded.userId,
      tags,
    });

    await newVideo.save();

    const videoUrl = `/${user.username}/${newVideo._id}/${slug}`;

    return NextResponse.json(
      { message: "Post created successfully", videoUrl },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log(`Error creating post: ${error}`);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}
