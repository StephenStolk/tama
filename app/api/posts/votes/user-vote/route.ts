import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongoose"
import Vote from "@/models/votes.model"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

interface IJwtPayload extends jwt.JwtPayload {
  userId: string
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const token = (await cookies()).get("token")?.value
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 })
    }

    const vote = await Vote.findOne({ author: decoded.userId, postId })

    return NextResponse.json({ vote }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user vote:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

