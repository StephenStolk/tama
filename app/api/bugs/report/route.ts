import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import BugReport from "@/models/BugReport";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    const data = await request.json();

    // Validate the request data
    if (!data.title || !data.description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // Get user from token if available
    let userId = null;
    let userEmail = null;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = verifyToken(token) as { id: string; email: string };
        userId = decoded.id;
        userEmail = decoded.email;
      } catch (error) {
        console.log("Token verification failed:", error);
        // Continue without user info
      }
    }

    // Create a new bug report
    const bugReport = new BugReport({
      title: data.title,
      description: data.description,
      status: "open",
      userId,
      userEmail,
    });

    // Save the bug report to MongoDB
    await bugReport.save();

    return NextResponse.json(
      {
        message: "Bug report submitted successfully",
        bugReport: {
          id: bugReport._id,
          title: bugReport.title,
          description: bugReport.description,
          status: bugReport.status,
          createdAt: bugReport.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing bug report:", error);
    return NextResponse.json(
      { message: "Failed to process bug report" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Verify admin access
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all bug reports (you might want to add pagination later)
    const bugReports = await BugReport.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(
      {
        bugReports: bugReports.map((report) => ({
          id: report._id,
          title: report.title,
          description: report.description,
          status: report.status,
          createdAt: report.createdAt,
          userEmail: report.userEmail,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bug reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch bug reports" },
      { status: 500 }
    );
  }
}
