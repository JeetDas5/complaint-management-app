"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", form);
      const token = response.data.user.token;
      document.cookie = `token=${token}; path=/; max-age=${ 60 * 60}; SameSite=Lax`;

      toast.success("Logged in successfully");

      const role = response.data.user.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/submit");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Login to CMS
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Welcome back! Please sign in to your account.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input 
                name="email" 
                placeholder="Email" 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
              Register here
            </a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
