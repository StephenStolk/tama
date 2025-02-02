import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongoose"
import User from "@/models/user.model"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  await connectToDatabase()

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  // console.log("Token from cookie:", token)

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 })
  }

  try {
    // console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set")
    // console.log("Decoded token:", jwt.decode(token))
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    // console.log("Verified decoded token:", decoded)

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ message: "Error fetching user data", error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  await connectToDatabase()

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    const { username, bio } = await request.json()

    // Update the user details in the database
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { username, bio },
      { new: true }, // Return the updated document
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { password, ...userDetails } = user.toObject()

    return NextResponse.json({ user: userDetails }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Error updating user" }, { status: 500 })
  }
}

