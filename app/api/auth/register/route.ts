import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

  const { name, email, password, role } = await request.json();

  console.log("Registration request received:", { name, email, role });

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        error: "All fields are required",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const validRole = role === "admin" || role === "user" ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: validRole,
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "User registration failed",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        error: "User registration failed",
      },
      {
        status: 500,
      }
    );
  }
}
