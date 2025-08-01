import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { name, email, password } = await request.json();

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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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
