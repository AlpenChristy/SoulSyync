import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isValidEmail } from "@/lib/utils";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const subscribeNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/subscribers", { email });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success!",
          description: "You've been successfully subscribed to our newsletter.",
        });
        setEmail("");
      } else {
        setErrorMessage(data.message || "Subscription failed. Please try again.");
      }
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.");
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    subscribeNewsletter.mutate(email);
  };

  return (
    <section className="bg-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:p-10 lg:p-12 lg:flex lg:items-center">
            <div className="lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Get Daily Wisdom in Your Inbox
              </h2>
              <p className="mt-2 text-lg text-white">
                Subscribe to our newsletter for daily horoscopes, spiritual guidance, and healing tips.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:w-1/3 lg:pl-8">
              <form onSubmit={handleSubmit} className="sm:flex flex-col sm:flex-row">
                <div className="flex-grow">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 border-0 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  {errorMessage && (
                    <p className="mt-1 text-sm text-white bg-red-600/20 px-2 py-1 rounded">
                      {errorMessage}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={subscribeNewsletter.isPending}
                  className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50"
                >
                  {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
