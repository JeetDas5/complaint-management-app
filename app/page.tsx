// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <Toaster />
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to Complaint Management System
      </h1>
      <p className="text-lg text-center mb-6 max-w-xl">
        This is a platform where you can register complaints, track their status,
        and manage your interactions with the support team. Please log in or
        register to get started.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Register</Button>
        </Link>
      </div>
    </main>
  );
}
