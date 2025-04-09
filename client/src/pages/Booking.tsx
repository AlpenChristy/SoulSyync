import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/booking/BookingForm";
import TestimonialsList from "@/components/booking/TestimonialsList";

const Booking = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login?redirect=/booking");
      return;
    }
  }, [isAuthenticated, setLocation]);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: Service[] }>({
    queryKey: ["/api/services"],
  });

  const services = data?.data || [];

  if (!isAuthenticated) {
    return null;
  }
  
  console.log("Booking user:", user);

  return (
    <>
      <Helmet>
        <title>Book Your Healing Session | SoulSyync</title>
        <meta name="description" content="Schedule your spiritual healing session with our experienced practitioners." />
      </Helmet>

      <section id="booking" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-800">Book Your Healing Session</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Take the first step on your healing journey. Choose a service, select a date and time that works for you.
            </p>
          </div>
          
          <div className="mt-12 lg:flex lg:items-start lg:space-x-8">
            {/* Booking Form */}
            <div className="lg:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <Tabs defaultValue="services">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="services">Select Service</TabsTrigger>
                    <TabsTrigger value="booking" disabled={!selectedServiceId}>Book Appointment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="services">
                    <h3 className="text-xl font-heading font-semibold text-slate-800 mb-6 mt-4">Choose Your Service</h3>
                    
                    {isLoading ? (
                      <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <div className="flex justify-between mt-4">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-9 w-24" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-500 py-8">
                        <p>Failed to load services. Please try again later.</p>
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No services available at the moment. Please check back later.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {services.map((service) => (
                          <div 
                            key={service.id} 
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedServiceId === service.id 
                                ? "border-primary-500 bg-primary-50" 
                                : "hover:border-primary-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedServiceId(service.id)}
                          >
                            <h4 className="text-lg font-heading font-semibold text-slate-800">{service.name}</h4>
                            <p className="mt-1 text-slate-600 text-sm">{service.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                              <div className="text-primary-600 font-semibold">
                                ${(service.price / 100).toFixed(2)}
                                <span className="text-slate-500 font-normal text-sm ml-2">
                                  ({service.duration} minutes)
                                </span>
                              </div>
                              <button 
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  selectedServiceId === service.id
                                    ? "bg-primary-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                                }`}
                                onClick={() => setSelectedServiceId(service.id)}
                              >
                                {selectedServiceId === service.id ? "Selected" : "Select"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="booking">
                    {selectedServiceId && (
                      <BookingForm 
                        serviceId={selectedServiceId} 
                        service={services.find(s => s.id === selectedServiceId)} 
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <TestimonialsList serviceId={selectedServiceId} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
