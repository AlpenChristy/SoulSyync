import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Check, X, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TestimonialsManager = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState<number[]>([]);

  // Fetch all testimonials
  const { data, isLoading } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ["/api/testimonials/all"],
  });

  const testimonials = data?.data || [];

  // Helper function to determine if a testimonial is approved (handles PostgreSQL boolean values)
  const isApproved = (testimonial: Testimonial) => {
    if (testimonial.approved === null) return false;
    if (typeof testimonial.approved === 'boolean') return testimonial.approved;
    // Handle string representation from PostgreSQL
    const approvedStr = String(testimonial.approved).toLowerCase();
    return approvedStr === 'true' || approvedStr === 't' || approvedStr === '1';
  };

  // Filter testimonials based on approval status and search
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesStatus = 
      (currentTab === "pending" && !isApproved(testimonial)) ||
      (currentTab === "approved" && isApproved(testimonial));
    
    const matchesSearch = 
      testimonial.name?.toLowerCase().includes(search.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Approve testimonial mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/testimonials/${id}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testimonial status updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update testimonial status",
        variant: "destructive",
      });
    },
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/testimonials/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testimonial deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      setTestimonialToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete testimonial",
        variant: "destructive",
      });
    },
  });

  // Bulk actions
  const bulkApproveMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await apiRequest("POST", `/api/testimonials/bulk-approve`, { ids });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${selectedTestimonials.length} testimonials approved`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      setSelectedTestimonials([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve testimonials",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await apiRequest("POST", `/api/testimonials/bulk-delete`, { ids });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${selectedTestimonials.length} testimonials deleted`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      setSelectedTestimonials([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete testimonials",
        variant: "destructive",
      });
    },
  });

  // Handle checkbox selection
  const handleSelectTestimonial = (id: number) => {
    setSelectedTestimonials((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === filteredTestimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(filteredTestimonials.map((t) => t.id));
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-semibold">Testimonials Management</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedTestimonials.length > 0 && (
        <div className="bg-slate-50 p-3 rounded-md mb-4 flex items-center justify-between">
          <span className="text-sm text-slate-700">
            {selectedTestimonials.length} testimonials selected
          </span>
          <div className="space-x-2">
            {currentTab === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkApproveMutation.mutate(selectedTestimonials)}
                disabled={bulkApproveMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Selected
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => bulkDeleteMutation.mutate(selectedTestimonials)}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border">
          <p className="text-gray-500">No testimonials found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    filteredTestimonials.length > 0 &&
                    selectedTestimonials.length === filteredTestimonials.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-1/3">Testimonial</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTestimonials.includes(testimonial.id)}
                    onCheckedChange={() => handleSelectTestimonial(testimonial.id)}
                    aria-label={`Select testimonial ${testimonial.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>{testimonial.serviceId ? `Service #${testimonial.serviceId}` : "General"}</TableCell>
                <TableCell>
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                <TableCell>
                  {new Date(testimonial.createdAt || Date.now()).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!isApproved(testimonial) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => approveMutation.mutate(testimonial.id)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTestimonialToDelete(testimonial)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!testimonialToDelete}
        onOpenChange={(open) => !open && setTestimonialToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => testimonialToDelete && deleteMutation.mutate(testimonialToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialsManager;