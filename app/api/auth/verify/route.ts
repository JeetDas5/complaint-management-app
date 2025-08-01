import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const verified = verifyToken(token);
    
    if (verified) {
      return NextResponse.json({ 
        valid: true, 
        userId: verified.userId, 
        role: verified.role 
      });
    } else {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}