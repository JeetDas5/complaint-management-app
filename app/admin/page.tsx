"use client";

import React, { useState, useEffect } from "react";
import ClientOnly from "@/components/ClientOnly";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Trash2, Eye, Filter, RefreshCw, Search } from "lucide-react";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "resolved";
  dateSubmitted: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<string | null>(
    null
  );
  const [mounted, setMounted] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  const fetchComplaints = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      toast.error("Please log in to access admin panel");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("/api/complaint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(response.data);
      setFilteredComplaints(response.data);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to fetch complaints";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (
    complaintId: string,
    newStatus: string
  ) => {
    const token = getTokenFromCookie();
    if (!token) {
      toast.error("Please log in to update complaints");
      return;
    }

    try {
      await axios.patch(
        `/api/complaint/${complaintId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Complaint status updated successfully");
      fetchComplaints();
    } catch (error: any) {
      console.error("Error updating complaint:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update complaint";
      toast.error(errorMessage);
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    const token = getTokenFromCookie();
    if (!token) {
      toast.error("Please log in to delete complaints");
      return;
    }

    try {
      await axios.delete(`/api/complaint/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Complaint deleted successfully");
      setIsDeleteOpen(false);
      setComplaintToDelete(null);
      fetchComplaints();
    } catch (error: any) {
      console.error("Error deleting complaint:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete complaint";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    let filtered = complaints;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.priority === priorityFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, statusFilter, priorityFilter, searchTerm]);

  useEffect(() => {
    setMounted(true);
    fetchComplaints();
  }, []);

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "success";
      case "in-progress":
        return "info";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    if (!mounted) {
      // Return a simple format during SSR to prevent hydration mismatch
      return new Date(dateString).toISOString().split('T')[0];
    }

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      // Fallback if date formatting fails
      return new Date(dateString).toISOString().split('T')[0];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Navbar userRole={user?.role} userName={user?.name} />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Complaint Management
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Manage and track all customer complaints
                </p>
              </div>
              <Button
                onClick={fetchComplaints}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <Label className="text-sm font-medium">Filters:</Label>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="search" className="text-sm">
                  Search:
                </Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="text-sm">
                  Status:
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="priority-filter" className="text-sm">
                  Priority:
                </Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(statusFilter !== "all" ||
                priorityFilter !== "all" ||
                searchTerm) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Loading complaints...
                  </span>
                </div>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-300">
                  {complaints.length === 0
                    ? "No complaints found."
                    : "No complaints match your filters."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={complaint.title}>
                          {complaint.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {complaint.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPriorityBadgeVariant(complaint.priority)}
                          className="capitalize"
                        >
                          {complaint.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={complaint.status}
                          onValueChange={(value) =>
                            updateComplaintStatus(complaint._id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <Badge
                              variant={getStatusBadgeVariant(complaint.status)}
                              className="capitalize"
                            >
                              {complaint.status.replace("-", " ")}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(complaint.dateSubmitted)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{complaint.user.name}</div>
                          <div className="text-sm text-slate-500">
                            {complaint.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDialogLoading(true);
                              setSelectedComplaint(complaint);
                              setIsDetailsOpen(true);
                              setDialogLoading(false);
                            }}
                            disabled={dialogLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDialogLoading(true);
                              setComplaintToDelete(complaint._id);
                              setIsDeleteOpen(true);
                              setDialogLoading(false);
                            }}
                            disabled={dialogLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {mounted && (
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>
          )}
        </div>

        <ClientOnly>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Complaint Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this complaint
                </DialogDescription>
              </DialogHeader>
              {selectedComplaint && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Title
                    </Label>
                    <p className="mt-1 text-sm">{selectedComplaint.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description
                    </Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </Label>
                      <p className="mt-1">
                        <Badge variant="outline" className="capitalize">
                          {selectedComplaint.category}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Priority
                      </Label>
                      <p className="mt-1">
                        <Badge
                          variant={getPriorityBadgeVariant(
                            selectedComplaint.priority
                          )}
                          className="capitalize"
                        >
                          {selectedComplaint.priority}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </Label>
                      <p className="mt-1">
                        <Badge
                          variant={getStatusBadgeVariant(selectedComplaint.status)}
                          className="capitalize"
                        >
                          {selectedComplaint.status.replace("-", " ")}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Date Submitted
                      </Label>
                      <p className="mt-1 text-sm">
                        {formatDate(selectedComplaint.dateSubmitted)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Submitted By
                    </Label>
                    <div className="mt-1">
                      <p className="text-sm font-medium">
                        {selectedComplaint.user.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedComplaint.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Complaint</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this complaint? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    complaintToDelete && deleteComplaint(complaintToDelete)
                  }
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ClientOnly>
      </main >
      <Footer />
    </div >
  );
};

export default AdminPage;
