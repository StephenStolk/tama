import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const { postId, score, type } = await req.json();

        if (!postId || typeof score !== "number" || !type) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        let Model;
        switch (type) {
            case "post":
                Model = Post;
                break;
            case "image":
                Model = Image;
                break;
            case "video":
                Model = Video;
                break;
            case "poll":
                Model = Poll;
                break;
            default:
                return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
        }

        const updatedPost = await Model.findByIdAndUpdate(
            postId,
            { score },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Score updated successfully", score: updatedPost.score });
    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
