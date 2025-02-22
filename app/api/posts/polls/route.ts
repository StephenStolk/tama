import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongoose";
import Poll from "@/models/poll.model"
import User from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";

interface IJwtPayload extends JwtPayload {
  userId: string;
}

export async function POST(request: Request) {
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
    const pollOptions = formData.get("pollOptions")
      ? JSON.parse(formData.get("pollOptions") as string)
      : [];
    const tags = formData.getAll("tags") as string[];
    

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    if(type !== "poll"){
        return NextResponse.json(
            {
                message: "Poll is not defined"
            }, {status: 400}
        )
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
    const existingPoll = await Poll.findOne({ slug });
    if (existingPoll) {
      slug = `${slug}-${Date.now()}`;
    }

    

    const newPoll = new Poll({
      title,
      type,
      pollOptions,
      slug,
      author: decoded.userId,
      tags,
    });

    await newPoll.save();

    const pollUrl = `/${user.username}/${newPoll._id}/${slug}`;

    return NextResponse.json(
      { message: "Post Poll created successfully", pollUrl },
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

    const polls = await Poll.find().populate("author", "username");

    if (polls.length === 0) {
      return NextResponse.json({ message: "No polls found" }, { status: 404 });
    }

    const pollResponse = polls.map((poll) => ({
      _id: poll._id,
      title: poll.title,
      type: "poll",
      pollOptions: poll.pollOptions,
      slug: poll.slug,
      tags: poll.tags,
      author: poll.author?.username || "unknown", // ✅ Ensure username exists
      createdAt: poll.createdAt,
    }));

    return NextResponse.json(pollResponse, { status: 200 });
  } catch (error: unknown) {
    console.log(`Error fetching polls: ${error}`);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}
