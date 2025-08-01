import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Complaint from "@/models/Complaint";
import { sendEmail } from "@/lib/sendEmail";
import { generateStatusUpdateEmail } from "@/lib/emailTemplates";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required to update the complaint" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findById(id).populate("user", "name email");

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.status === status) {
      return NextResponse.json(
        { message: "Complaint status is already set to this value" },
        { status: 200 }
      );
    }

    const previousStatus = complaint.status;
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate("user", "name email");

    const { subject, html } = generateStatusUpdateEmail(
      updatedComplaint, 
      updatedComplaint.user, 
      previousStatus
    );
    const fallbackText = `The status of the complaint titled "${complaint.title}" has been updated to "${status}".\n\nDescription: ${complaint.description}\nCategory: ${complaint.category}\nPriority: ${complaint.priority}\nDate Submitted: ${complaint.dateSubmitted.toISOString()}\n\nPlease take the necessary actions.`;

    sendEmail(subject, fallbackText, html);

    return NextResponse.json(
      { message: "Complaint updated successfully", complaint: updatedComplaint },
      { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params;

    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Complaint deleted successfully" },
      { status: 200 }
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
