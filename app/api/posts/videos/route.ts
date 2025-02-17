import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import jwt, {JwtPayload} from "jsonwebtoken";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user.model";
import Video from "@/models/video.model";
import { cookies } from "next/headers";

interface IJwtPayload extends JwtPayload {
    userId: string;
}

export async function POST(request: NextRequest) {
    try {
        const token = (await cookies()).get("token")?.value;

        if(!token) {
            console.log("Unauthorized");
            return NextResponse.json({

                message: "unauthorized"
            }, { status: 401})
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
        } catch (error: unknown){
            console.log("JWT Error", error);
            return NextResponse.json({
                message: "Invalid or expired token"
            }, { status: 401});
        }

        const formData = await request.formData();
        const title = formData.get("title") as string;
        const type = formData.get("type") as string;
        const file = formData.get("file")
    }
}