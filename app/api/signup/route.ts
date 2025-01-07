import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model"; // Ensure you have the User model
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords
import validator from "validator"; // Import validator for email validation

export async function POST(request: Request) {
  const { username, bio, email, password } = await request.json();

  // Validate input
  if (!username || !email || !password || !bio) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // Email validation using validator
  if (!validator.isEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10); // Generate salt (rounds = 10)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user
    const newUser = new User({
      username,
      bio,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user" },
      { status: 500 }
    );
  }
}
