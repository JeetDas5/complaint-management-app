import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: string, role: string = "user"): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): { userId: string, role: string } | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
