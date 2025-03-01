// /api/ads/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import adsModel from "@/models/ads.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const ads = await adsModel.find({ status: "active" }).lean();
    return NextResponse.json({ ads }, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
