import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, StarIcon } from "lucide-react";

interface TestimonialsListProps {
  serviceId: number | null;
}

const TestimonialsList = ({ serviceId }: TestimonialsListProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    content: "",
    rating: 5,
    name: "",
    serviceId: serviceId,
  });

  // Fetch testimonials
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ["/api/testimonials", { serviceId: serviceId }],
    enabled: true,
  });

  const testimonials = data?.data || [];

  // Submit testimonial mutation
  const submitTestimonial = useMutation({
    mutationFn: async (testimonialData: typeof newTestimonial) => {
      const res = await apiRequest("POST", "/api/testimonials", testimonialData);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Thank You!",
          description: "Your testimonial has been submitted for review.",
        });
        setIsDialogOpen(false);
        setNewTestimonial({
          content: "",
          rating: 5,
          name: "",
          serviceId: serviceId,
        });
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "There was an error submitting your testimonial.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your testimonial.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (value: string) => {
    setNewTestimonial(prev => ({
      ...prev,
      rating: parseInt(value),
    }));
  };

  const handleServiceChange = (value: string) => {
    setNewTestimonial(prev => ({
      ...prev,
      serviceId: parseInt(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTestimonial.content) {
      toast({
        title: "Error",
        description: "Please enter your testimonial content",
        variant: "destructive",
      });
      return;
    }
    
    if (!newTestimonial.name && !isAuthenticated) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    submitTestimonial.mutate({
      ...newTestimonial,
      serviceId: newTestimonial.serviceId || null,
    });
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-semibold text-slate-800">Client Testimonials</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {!isAuthenticated && (
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <input
                    id="name"
                    name="name"
                    value={newTestimonial.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="service">Service</Label>
                <Select 
                  value={newTestimonial.serviceId?.toString() || ""}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Spiritual Counseling</SelectItem>
                    <SelectItem value="2">Chakra Balancing</SelectItem>
                    <SelectItem value="3">Aura Cleansing</SelectItem>
                    <SelectItem value="4">Meditation Guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rating">Your Rating</Label>
                <Select 
                  value={newTestimonial.rating.toString()} 
                  onValueChange={handleRatingChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">
                      <div className="flex items-center">
                        {renderStars(5)}
                        <span className="ml-2">Excellent</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center">
                        {renderStars(4)}
                        <span className="ml-2">Very Good</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center">
                        {renderStars(3)}
                        <span className="ml-2">Good</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center">
                        {renderStars(2)}
                        <span className="ml-2">Fair</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center">
                        {renderStars(1)}
                        <span className="ml-2">Poor</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Your Testimonial</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={newTestimonial.content}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share your experience with our services..."
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Your testimonial will be reviewed before being published.
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={submitTestimonial.isPending}
              >
                {submitTestimonial.isPending ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6 bg-white rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          <p>Failed to load testimonials. Please try again later.</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <Star className="mx-auto h-12 w-12 text-gray-300" />
          <h4 className="mt-2 text-lg font-medium text-gray-900">No testimonials yet</h4>
          <p className="mt-1 text-sm text-gray-500">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="mb-6 bg-white rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {testimonial.name ? 
                      testimonial.name.split(" ").map(part => part[0]).join("").toUpperCase().substring(0, 2) : 
                      "CS"
                    }
                  </span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-slate-800">{testimonial.name || "Client"}</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-slate-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
