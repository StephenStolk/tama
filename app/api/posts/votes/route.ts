import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import { Vote } from "@/models/votes.model";
import { cookies } from "next/headers";
import slugify from "slugify";

import Post from "@/models/post.model";
import User from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";


await connectToDatabase();

interface IJwtPayload extends JwtPayload {
    userId: string;
}


//post vote
export async function POST(req: NextRequest) {
    try {
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

            const user = User.findById(decoded.userId);
            if(!user) {
                return NextResponse.json({
                    message: "The user does not exist"
                }, {status: 400});
            }

            const {postId, type, voteType } = await req.json();

            const postTypes = ["post", "image","video","poll"];
            if(!postTypes.includes(type)) {
                return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
            }

            const existingVote = await Vote.findOne({ author: decoded.userId, postId})

            if (existingVote) {
                if (existingVote.voteType === voteType) {
                    return NextResponse.json({ error: "You already voted this way" }, { status: 400 });
                }
                existingVote.voteType = voteType;
                await existingVote.save();
                return NextResponse.json({ message: "Vote updated", vote: existingVote }, { status: 200 });
            }

            const newVote = await Vote.create({ author: decoded.userId, postId, type, voteType});

            return NextResponse.json({ message: "Vote added", vote: newVote }, { status: 201 });

    } catch (error: unknown) {
        alert(error);
        return NextResponse.json({
            message: "An error occurred"
        }, {status: 404})
    }
}


//delete vote
export async function DELETE(req: NextRequest) {
    try {
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

            const user = User.findById(decoded.userId);
            if(!user) {
                return NextResponse.json({
                    message: "The user does not exist"
                }, {status: 400});
            }

            const {searchParams } = new URL(req.url);
            const postId = searchParams.get("postId");
            
            if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

            const deletedVote = await Vote.findOneAndDelete({ author: decoded.userId, postId});

            if (!deletedVote) {
                return NextResponse.json({ error: "Vote not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Vote removed" }, { status: 200 });

    } catch (error: unknown){
        console.log(error);
        alert(error);
        return NextResponse.json({
            message: "An error occurred"
        }, {status: 404})
    }
}


//Get vote count
export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const postId = searchParams.get("postId");

        if(!postId) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        const upvotes = await Vote.countDocuments({ postId, voteType: "upvote"});
        const downvotes = await Vote.countDocuments({ postId, voteType: "downvote"});
        return NextResponse.json({ upvotes, downvotes }, { status: 200 });

    } catch(error: unknown){
        return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
    }
}