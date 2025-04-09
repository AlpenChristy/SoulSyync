import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/hooks/useAuth";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import ServicesPreview from "@/components/home/ServicesPreview";
import HoroscopePreview from "@/components/home/HoroscopePreview";
import BlogPreview from "@/components/home/BlogPreview";
import { Helmet } from "react-helmet";

const HomeContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>SoulSyync - Spiritual Counseling & Healing</title>
        <meta name="description" content="Find inner peace with SoulSyync's spiritual counseling, daily horoscopes, and healing sessions. Book your journey to wellness today." />
      </Helmet>
      
      <Hero />
      {/* <Newsletter /> */}
      <ServicesPreview />
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-8">
            <HoroscopePreview />
            <BlogPreview />
          </div>
        </div>
      </section>
      <Newsletter />
      <section id="about" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-slate-800">About SoulSyync</h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              We're dedicated to guiding you through your spiritual journey with compassion and wisdom.
            </p>
          </div>
          
          <div className="mt-12 lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-heading font-semibold text-slate-800">Our Mission</h3>
              <p className="mt-4 text-slate-600">
                At SoulSyync, we believe that spiritual wellness is essential for a fulfilling life. Our mission is to provide accessible, authentic spiritual guidance and healing services that empower individuals to connect with their higher selves, find inner peace, and live with purpose.
              </p>
              
              <h3 className="mt-8 text-2xl font-heading font-semibold text-slate-800">Our Approach</h3>
              <p className="mt-4 text-slate-600">
                We combine ancient wisdom with modern understanding, offering a holistic approach to spiritual counseling that honors diverse traditions while remaining grounded in practical application. Each session is personalized to meet you where you are on your unique journey.
              </p>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="chakra-bg rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-heading font-semibold text-slate-800 mb-6">Our Values</h3>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-heading font-semibold text-slate-800">Compassion</h4>
                      <p className="mt-2 text-slate-600">We approach every individual with unconditional positive regard and deep empathy.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-heading font-semibold text-slate-800">Integrity</h4>
                      <p className="mt-2 text-slate-600">We maintain the highest ethical standards in our practice and personal conduct.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-heading font-semibold text-slate-800">Empowerment</h4>
                      <p className="mt-2 text-slate-600">We believe in equipping you with the tools and wisdom to continue your growth independently.</p>
                    </div>
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

const Home = () => {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
};

export default Home;
