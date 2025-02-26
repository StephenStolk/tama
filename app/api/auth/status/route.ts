import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import { cookies } from "next/headers";
import User from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";


await connectToDatabase();

interface IJwtPayload extends JwtPayload {
    userId: string;
}


export async function GET(req: NextRequest) {
    try {
        const token = (await cookies()).get("token")?.value;

            if (!token) return NextResponse.json({ isAuthenticated: false }, { status: 401 });
        
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
                    isAuthenticated: false,
                }, {status: 400});
            }

            return NextResponse.json({ isAuthenticated: true, user: token });
    } catch (error: unknown){
        console.error("Error checking authentication status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}