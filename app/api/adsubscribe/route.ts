// /api/ads/subscribe.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import AdSubscription from "@/models/adSubscription.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { advertiser, packageType, endDate } = await req.json();

    const subscription = new AdSubscription({
      advertiser,
      packageType,
      endDate,
      isActive: true,
    });

    await subscription.save();
    return NextResponse.json({ success: true, subscription });
  } catch (error : unknown) {
    console.log(error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
