import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Complaint from "@/models/Complaint";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { generateNewComplaintEmail } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  await connectDB();
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tokenVerification = verifyToken(token);

  if (!tokenVerification?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = tokenVerification.userId;

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { title, description, category, priority } = body;

    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      user,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Failed to create complaint" },
        { status: 500 }
      );
    }
    const { subject, html } = generateNewComplaintEmail(complaint, user);
    const fallbackText = `A new complaint has been created:\n\nTitle: ${complaint.title}\nDescription: ${complaint.description}\nCategory: ${complaint.category}\nPriority: ${complaint.priority}\nSubmitted by: ${user.name} (${user.email})`;

    sendEmail(subject, fallbackText, html);

    return NextResponse.json(
      { message: "Complaint created successfully", complaint },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tokenVerification = verifyToken(token);

  if (!tokenVerification?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = tokenVerification.role === "admin";
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const complaints = await Complaint.find({}).populate("user", "name email");
    return NextResponse.json(complaints, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
