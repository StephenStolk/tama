import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";
import Image from "@/models/image.model";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model";

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
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Handle FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const file = formData.get("file") as File | null;
    const tags = formData.getAll("tags") as string[];

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    if (type !== "image") {
      return NextResponse.json({ message: "Image is not defined" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 });
    }

    if(tags.length >2) {
      return NextResponse.json({
        message: "You can select upto 2 tags only"
      }, { status: 400});
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let slug = slugify(title, { lower: true, strict: true });
    const existingImage = await Image.findOne({ slug });
    if (existingImage) {
      slug = `${slug}-${Date.now()}`;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-images", tags: [decoded.userId] },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);  // Log the actual error
              reject(new Error("Cloudinary upload failed"));    // Return a descriptive error
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      } catch (err) {
        console.error("Unexpected Error:", err);
        reject(new Error("Unexpected error during upload"));
      }
    });
    

    const newImage = new Image({
      title,
      type,
      imageUrl: result.secure_url,
      slug,
      author: decoded.userId,
      tags,
    });

    await newImage.save();

    const imageUrl = `/${user.username}/${newImage._id}/${slug}`;

    return NextResponse.json(
      { message: "Post created successfully", imageUrl },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log(`Error creating post: ${error}`);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const images = await Image.find().populate("author","username");

    if(images.length === 0) {
      return NextResponse.json({
        message: "No Images found"
      }, { status: 404});
    }
    const imageResponse = images.map((image) => ({
      _id: image._id,
      title: image.title,
      type: "image", // ✅ Add this to match frontend expectation
      imageUrl: image.imageUrl,
      slug: image.slug,
      author: image.author.username, // ✅ Include author username
      createdAt: image.createdAt,
    }));
  
      return NextResponse.json(imageResponse, { status: 200 });
  } catch (error: unknown) {
    console.log(`Error fetching images: ${error}`);
    return NextResponse.json({ message: "Error fetching images" }, { status: 500 });
  }
}