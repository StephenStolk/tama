// app/api/login/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // For JWT token creation

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Respond with user data and the token
    return NextResponse.json(
      {
        user: {
          username: user.username,
          email: user.email,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user" },
      { status: 500 }
    );
  }
}
