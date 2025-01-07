import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model";  // Make sure you have the User model defined

export async function POST(request: Request) {
  const { username, bio, email, password } = await request.json();

  // Validate input
  if (!username || !email || !password || !bio) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create a new user
    const newUser = new User({ username, bio, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json({ message: "Error signing up user" }, { status: 500 });
  }
}
