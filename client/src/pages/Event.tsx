import React from 'react';

const EventsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Events</h1>
        <p className="text-gray-600">Discover upcoming events, our event types, past highlights, and partners.</p>
      </header>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Event Card */}
          {[1, 2, 3].map((e) => (
            <div key={e} className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
              <h3 className="text-xl font-bold mb-2">Mindfulness Workshop</h3>
              <p className="text-sm text-gray-600">April 20, 2025 • Online</p>
              <p className="text-gray-700 mt-2">A calming session to help you reconnect with your inner self.</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Types of Events */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Types of Events We Organize</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Therapy Workshops</li>
          <li>Motivational Seminars</li>
          <li>Community Wellness Meetups</li>
          <li>Online Meditation Sessions</li>
          <li>Guest Speaker Panels</li>
        </ul>
      </section>

      {/* Previous Events */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Previous Events</h2>
        <div className="space-y-6">
          {/* Example Previous Event */}
          {[1, 2].map((e) => (
            <div key={e} className="flex flex-col md:flex-row bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex-1">
                <h3 className="text-lg font-bold">Mental Health Awareness Day</h3>
                <p className="text-sm text-gray-600">February 10, 2025 • In-Person</p>
                <p className="text-gray-700 mt-2">An insightful event that focused on spreading awareness about mental wellness through engaging sessions and community support.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Partners */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Our Event Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Replace with actual logos or names */}
          {['MindCare Org', 'TherapyHub', 'Wellness Now', 'ZenSpace'].map((partner, index) => (
            <div key={index} className="flex justify-center items-center p-4 bg-white rounded shadow text-gray-800 font-semibold">
              {partner}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
