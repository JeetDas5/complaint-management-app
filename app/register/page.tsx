"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", form);
      if (response.status !== 201) {
        throw new Error("Registration failed");
      }
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Register to CMS
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Create your account to get started.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input 
                name="name" 
                placeholder="Full Name" 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <Input 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">
                Account Type
              </Label>
              <Select
                value={form.role}
                onValueChange={(value) => {
                  setForm({ ...form, role: value });
                }}
              >
                <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200">
              Login here
            </a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
