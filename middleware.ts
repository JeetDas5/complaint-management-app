import { NextRequest, NextResponse } from "next/server";

async function verifyTokenEdge(
  token: string
): Promise<{ userId: string; role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    if (!payload.userId || !payload.role) {
      return null;
    }

    return { userId: payload.userId, role: payload.role };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    if (token) {
      try {
        const isVerified = await verifyTokenEdge(token);
        if (isVerified) {
          if (pathname === "/login" || pathname === "/register") {
            const userRole = isVerified.role;
            if (userRole === "admin") {
              return NextResponse.redirect(new URL("/admin", request.url));
            } else {
              return NextResponse.redirect(new URL("/submit", request.url));
            }
          }
        }
      } catch (error) {
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const isVerified = await verifyTokenEdge(token);

    if (!isVerified || !isVerified.userId) {
      throw new Error("Invalid token");
    }

    const userRole = isVerified.role;

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/submit", request.url));
    }

    if (pathname.startsWith("/submit") && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/", "/admin/:path*", "/submit/:path*", "/login", "/register"],
};
