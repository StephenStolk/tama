import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = params.id; // Access id directly instead of destructuring
    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const collections = [
      { model: Post, type: "post" },
      { model: Image, type: "image" },
      { model: Video, type: "video" },
      { model: Poll, type: "poll" },
    ];

    let post = null;
    let postType = "";

    for (const { model, type } of collections) {
      const result = await model.findById(id).populate("author", "username");
      if (result) {
        post = result;
        postType = type;
        break;
      }
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = {
      _id: post._id,
      title: post.title,
      type: postType,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      pollOptions: post.pollOptions,
      slug: post.slug,
      tags: post.tags,
      author: post.author.username,
      createdAt: post.createdAt,
    };

    return NextResponse.json(postData);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}