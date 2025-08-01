"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const SubmitPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
    { value: "support", label: "Support" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleInputChange = (field: keyof ComplaintFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a complaint title");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.priority) {
      toast.error("Please select a priority");
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      toast.error("Please log in to submit a complaint");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/complaint", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Complaint submitted successfully!");

        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
        });
      }
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to submit complaint";

      if (error.response?.status === 401) {
        toast.error("Please log in to submit a complaint");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Navbar userRole={user?.role} userName={user?.name} />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Submit a Complaint
              </h1>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Please fill out the form below to submit your complaint. We'll
                review it and get back to you soon.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2 group">
                <Label
                  htmlFor="title"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Complaint Title *
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter a brief title for your complaint"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 group-hover:border-slate-400"
                    required
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </div>


              <div className="space-y-2 group">
                <Label
                  htmlFor="description"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Description *
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Please provide a detailed description of your complaint..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full min-h-[120px] resize-y transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 group-hover:border-slate-400"
                    required
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </div>


              <div className="space-y-2 group">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">
                  Category *
                </Label>
                <div className="relative">
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 group-hover:border-slate-400">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </div>


              <div className="space-y-3">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">
                  Priority *
                </Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                  className="flex flex-col space-y-3"
                >
                  {priorities.map((priority) => (
                    <div
                      key={priority.value}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer group"
                    >
                      <RadioGroupItem
                        value={priority.value}
                        id={priority.value}
                        className="border-2"
                      />
                      <Label
                        htmlFor={priority.value}
                        className="text-slate-600 dark:text-slate-400 cursor-pointer font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-200 flex-1"
                      >
                        {priority.label}
                        <span className="block text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                          {priority.value === "low" &&
                            "Non-urgent issues that can be addressed later"}
                          {priority.value === "medium" &&
                            "Issues that need attention within a reasonable timeframe"}
                          {priority.value === "high" &&
                            "Urgent issues requiring immediate attention"}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Submit Complaint</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitPage;
