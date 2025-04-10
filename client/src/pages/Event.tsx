import React from "react";
import { Helmet } from "react-helmet";
import { AuthProvider } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";


const EventsContent = () => {
  return (
    <>
      <Helmet>
        <title>Our Events | SoulSyync</title>
        <meta
          name="description"
          content="Discover SoulSyync's upcoming spiritual events, healing workshops, and partner collaborations designed for your well-being."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-heading font-bold text-slate-800">SoulSyync Events</h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
            Discover upcoming events, explore our healing workshops, and meet our partners on this journey.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 bg-gray-40">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-heading font-bold text-slate-800 mb-8 text-center">Upcoming Events</h2>

    <div className="grid gap-8 md:grid-cols-2">
      {[1, 2].map((e, i) => (
        <div key={i} className="relative flex bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          
          {/* Left: Date */}
          <div className="flex flex-col items-center justify-center bg-slate-100 px-6 py-8 text-center relative w-24">
            <div className="text-3xl font-bold text-slate-900">20</div>
            <div className="text-sm text-slate-600">APR</div>

            {/* Notch Right */}
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-white rounded-full border border-gray-200"></div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 px-6 py-6 flex flex-col justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">ONLINE EVENT</p>
              <h3 className="text-lg font-heading font-bold text-slate-800 mb-2">Mindfulness Workshop</h3>
              <p className="text-sm text-slate-500">
                April 20, 2025 • 7:00 PM<br />
                Online via Zoom
              </p>
              <p className="text-sm text-slate-500 mt-1">
                A calming session to help you reconnect with your inner self.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="w-full sm:w-auto">BOOK NOW</Button>
              
            </div>
          </div>

          {/* Notch Left */}
          <div className="absolute -left-4 bottom-1/2 transform translate-y-1/2">
            <div className="w-8 h-8 bg-white rounded-full border border-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* Types of Events & Previous Events (Styled like Services layout) */}
      {/* <section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="lg:flex lg:gap-8 lg:items-start"> */}

       {/* Left: Types of Events */}
{/* <div className="lg:w-1/2 text-center">
  <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
    Types of Events We Organize
  </h2>

  <div className="bg-violet-50 p-20 rounded-xl shadow-sm inline-block text-left mx-auto max-w-md">
    <ul className="list-disc list-inside text-slate-700 text-base space-y-2">
      <li>Therapy Workshops</li>
      <li>Motivational Seminars</li>
      <li>Community Wellness Meetups</li>
      <li>Online Meditation Sessions</li>
      <li>Guest Speaker Panels</li>
    </ul>
  </div>
</div> */}


      {/* Right: Previous Events */}
      {/* <div className="mt-12 lg:mt-0 lg:w-1/2 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h2 className="text-2xl font-heading font-semibold text-slate-900 mb-4 text-center lg:text-left">
          Previous Events
        </h2>
        <div className="space-y-4">
          {[1, 2].map((e) => (
            <div
              key={e}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-slate-800">
                Mental Health Awareness Day
              </h3>
              <p className="text-sm text-slate-500">February 10, 2025 • In-Person</p>
              <p className="text-slate-700 mt-2 text-sm">
                An insightful event focused on mental wellness through engaging sessions and community support.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section> */}

<div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-20 items-start py-12 px-4 lg:px-20">

  {/* Types of Events */}
  <div className="w-full lg:w-1/2 text-center">
    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
      Types of Events We Organize
    </h2>

    <div className="bg-slate-50 border border-violet-100 rounded-xl px-9 py-6 max-w-md mx-auto shadow-sm">
      <ul className="list-disc list-inside text-slate-700 text-left space-y-2">
        <li>Therapy Workshops</li>
        <li>Motivational Seminars</li>
        <li>Community Wellness Meetups</li>
        <li>Online Meditation Sessions</li>
        <li>Guest Speaker Panels</li>
      </ul>
    </div>
  </div>

  {/* Previous Events */}
  <div className="w-full lg:w-1/2">
    <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
      <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
        Previous Events
      </h2>

      {/* Event Card */}
      {[1, 2].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-heading font-bold text-slate-900">Mental Health Awareness Day</h3>
          <p className="text-sm text-slate-500 mb-1">February 10, 2025 • In-Person</p>
          <p className="text-slate-700 text-sm">
            An insightful event focused on mental wellness through engaging sessions and community support.
          </p>
        </div>
      ))}
    </div>
  </div>

</div>

      {/* Event Partners */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-slate-800 mb-8">Our Event Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {["MindCare Org", "TherapyHub", "Wellness Now", "ZenSpace"].map((partner, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-4 bg-white rounded shadow text-slate-800 font-semibold"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* {/fqs/} */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-heading font-bold text-slate-800">What to Expect at Our Events</h2>
              <div className="mt-8 space-y-6">
                {[
                  {
                    step: 1,
                    title: "Registration",
                    desc: "Browse our event listings, select one that resonates with you, and complete your registration easily.",
                  },
                  {
                    step: 2,
                    title: "Preparation",
                    desc: "We’ll send you everything you need to know in advance—what to bring, how to join, and how to get the most out of it.",
                  },
                  {
                    step: 3,
                    title: "Experience",
                    desc: "Engage in a nurturing and supportive environment, guided by expert facilitators and fellow attendees.",
                  },
                  {
                    step: 4,
                    title: "Reflection",
                    desc: "Receive follow-up resources, recordings (if available), and ways to stay connected with the community.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
                        {step}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-heading font-semibold text-slate-800">{title}</h3>
                      <p className="mt-2 text-slate-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
            
                  <Button size="lg">Reserve Your Spot</Button>
                
              </div>
            </div>

            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-heading font-semibold text-slate-800 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {[
                    {
                      question: "Are events online or in-person?",
                      answer: "We offer both! Each event description will specify whether it’s virtual or held at a physical location.",
                    },
                    {
                      question: "How do I cancel or reschedule?",
                      answer: "Contact us at least 24 hours before the event. We understand that life happens and will work with you.",
                    },
                    {
                      question: "Can I invite friends or family?",
                      answer: "Absolutely. Many of our events encourage participation from groups and communities.",
                    },
                    {
                      question: "What should I bring to an event?",
                      answer: "You’ll receive details before your event, but typically we recommend an open heart, a journal, and comfy clothes.",
                    },
                  ].map((faq, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-heading font-semibold text-slate-800">{faq.question}</h3>
                      <p className="mt-2 text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const EventsPage = () => {
  return (
    <AuthProvider>
      <EventsContent />
    </AuthProvider>
  );
};

export default EventsPage;