import { AuthProvider } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const AboutContent = () => {
  return (
    <>
      <Helmet>
        <title>About Us | SoulSyync</title>
        <meta name="description" content="Learn about SoulSyync's mission, values, and team of spiritual counselors and healers." />
      </Helmet>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-800">About SoulSyync</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              We're dedicated to guiding you through your spiritual journey with compassion and wisdom.
            </p>
          </div>
          
          <div className="mt-12 lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-heading font-semibold text-slate-800">Our Story</h2>
              <p className="mt-4 text-slate-600">
                SoulSyync was founded with a vision to create a sanctuary where individuals could explore their spiritual path in a supportive, non-judgmental environment. What began as a small counseling practice has grown into a comprehensive spiritual wellness center, serving thousands of clients on their journeys toward inner peace and self-discovery.
              </p>
              
              <h2 className="mt-8 text-2xl font-heading font-semibold text-slate-800">Our Mission</h2>
              <p className="mt-4 text-slate-600">
                At SoulSyync, we believe that spiritual wellness is essential for a fulfilling life. Our mission is to provide accessible, authentic spiritual guidance and healing services that empower individuals to connect with their higher selves, find inner peace, and live with purpose.
              </p>
              
              <h2 className="mt-8 text-2xl font-heading font-semibold text-slate-800">Our Approach</h2>
              <p className="mt-4 text-slate-600">
                We combine ancient wisdom with modern understanding, offering a holistic approach to spiritual counseling that honors diverse traditions while remaining grounded in practical application. Each session is personalized to meet you where you are on your unique journey.
              </p>
              
              <div className="mt-8">
                <Link href="/services">
                  <Button>Explore Our Services</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="chakra-bg rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-heading font-semibold text-slate-800 mb-6">Our Values</h2>
                
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
                      <h3 className="text-lg font-heading font-semibold text-slate-800">Compassion</h3>
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
                      <h3 className="text-lg font-heading font-semibold text-slate-800">Integrity</h3>
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
                      <h3 className="text-lg font-heading font-semibold text-slate-800">Empowerment</h3>
                      <p className="mt-2 text-slate-600">We believe in equipping you with the tools and wisdom to continue your growth independently.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-heading font-semibold text-slate-800">Inclusivity</h3>
                      <p className="mt-2 text-slate-600">We honor the diversity of spiritual paths and welcome people from all backgrounds and beliefs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-slate-800">Meet Our Team</h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Our diverse team of spiritual practitioners brings together expertise from various healing traditions.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Sarah Johnson"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-slate-800">Sarah Johnson</h3>
                <p className="text-primary-600 font-medium">Spiritual Counselor, Founder</p>
                <p className="mt-3 text-slate-600">
                  With over 15 years of experience in spiritual counseling, Sarah combines intuitive guidance with practical wisdom to help clients navigate life's challenges.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="David Chen"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-slate-800">David Chen</h3>
                <p className="text-primary-600 font-medium">Energy Healer, Chakra Specialist</p>
                <p className="mt-3 text-slate-600">
                  David's expertise in energy healing and chakra balancing has helped countless clients restore harmony and vitality to their lives.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Maya Wilson"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-slate-800">Maya Wilson</h3>
                <p className="text-primary-600 font-medium">Meditation Teacher, Aura Specialist</p>
                <p className="mt-3 text-slate-600">
                  Maya's gentle approach to meditation guidance and aura cleansing creates a safe space for deep spiritual exploration and healing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const About = () => {
  return (
    <AuthProvider>
      <AboutContent />
    </AuthProvider>
  );
};

export default About;
