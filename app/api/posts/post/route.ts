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

    if (!title || !content) return NextResponse.json({ message: "Title and content are required" }, { status: 400 });

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
    });

    await newPost.save();

    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}
