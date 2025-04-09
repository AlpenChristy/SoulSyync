import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/common/ServiceCard";

const ServicesPreview = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Service[] }>({
    queryKey: ["/api/services"],
  });

  const services = data?.data || [];

  return (
    <section id="services" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-slate-800">Our Healing Services</h2>
          <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
            Explore our range of spiritual counseling and healing methods tailored to your personal journey.
          </p>
        </div>
        
        {isLoading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-500">
            <p>Failed to load services. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/services">
                <Button variant="link" className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2">
                  View all services
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesPreview;
