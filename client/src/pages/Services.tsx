import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import ServiceCard from "@/components/common/ServiceCard";

const ServicesContent = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: Service[] }>({
    queryKey: ["/api/services"],
  });

  const services = data?.data || [];

  return (
    <>
      <Helmet>
        <title>Our Services | SoulSyync</title>
        <meta name="description" content="Explore our range of spiritual counseling and healing services tailored to your personal journey." />
      </Helmet>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-800">Our Healing Services</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Explore our range of spiritual counseling and healing methods tailored to your personal journey.
            </p>
          </div>
          
          {isLoading ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((i) => (
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
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-heading font-bold text-slate-800">How Our Sessions Work</h2>
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-heading font-semibold text-slate-800">Booking</h3>
                    <p className="mt-2 text-slate-600">
                      Select your desired service, choose a date and time that works for you, and provide your information.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-heading font-semibold text-slate-800">Preparation</h3>
                    <p className="mt-2 text-slate-600">
                      You'll receive confirmation and preparation instructions to help you get the most from your session.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-heading font-semibold text-slate-800">Session</h3>
                    <p className="mt-2 text-slate-600">
                      Experience a personalized healing session tailored to your specific needs and spiritual journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-heading font-semibold text-slate-800">Follow-up</h3>
                    <p className="mt-2 text-slate-600">
                      Receive a session summary with insights and recommendations to continue your healing journey.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/booking">
                  <Button size="lg">Book Your Session Now</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-heading font-semibold text-slate-800 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">What should I expect from my first session?</h3>
                    <p className="mt-2 text-slate-600">
                      Your first session begins with a consultation to understand your needs and goals. We'll then guide you through the appropriate healing techniques, leaving time for questions and next steps.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">How do I prepare for a spiritual healing session?</h3>
                    <p className="mt-2 text-slate-600">
                      We recommend wearing comfortable clothing, staying hydrated, and setting an intention for your session. Try to arrive in a calm state of mind, perhaps after a short meditation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">How many sessions will I need?</h3>
                    <p className="mt-2 text-slate-600">
                      This varies by individual and your specific goals. Some experience significant benefits from a single session, while others prefer ongoing support. We'll provide recommendations after your first session.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-slate-800">What's your cancellation policy?</h3>
                    <p className="mt-2 text-slate-600">
                      We request 24 hours notice for cancellations. Late cancellations or no-shows may be subject to a fee. We understand emergencies happen and evaluate these situations individually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Services = () => {
  return (
    <AuthProvider>
      <ServicesContent />
    </AuthProvider>
  );
};

export default Services;
