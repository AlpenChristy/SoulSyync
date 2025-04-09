import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, addDays } from "date-fns";
import { AuthProvider } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HoroscopeSign from "@/components/common/HoroscopeSign";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HoroscopeContent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSign, setSelectedSign] = useState("aries");

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { data, isLoading, error } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: [`/api/horoscopes`, { date: formattedDate }],
  });

  // Debug to see what's coming from the server
  console.log("Horoscope page API response:", data);
  console.log("Requested date:", formattedDate);

  const horoscopes = data?.data || [];
  console.log("Horoscope page parsed horoscopes:", horoscopes);
  
  const currentHoroscope = horoscopes.find(h => {
    // Debug each horoscope to see what we're searching through
    console.log("Horoscope page checking horoscope:", h, "against selected sign:", selectedSign);
    return h.sign?.toLowerCase() === selectedSign.toLowerCase();
  });
  
  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(selectedDate, 1);
    if (tomorrow <= new Date()) {
      setSelectedDate(tomorrow);
    }
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = addDays(new Date(), 1);
    return format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd");
  };

  return (
    <>
      <Helmet>
        <title>Daily Horoscopes | SoulSyync</title>
        <meta name="description" content="Find guidance in the celestial wisdom of your daily horoscope." />
      </Helmet>

      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-800">Daily Horoscope</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Find guidance in the celestial wisdom of your daily horoscope.
            </p>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Date Navigation */}
              <div className="flex justify-between items-center mb-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrevDay}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous Day
                </Button>
                <span className="text-sm font-medium text-slate-700">{format(selectedDate, "MMMM d, yyyy")}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNextDay}
                  disabled={isTomorrow(selectedDate)}
                  className="flex items-center"
                >
                  Next Day
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Zodiac Sign Selection */}
              <div className="flex flex-wrap gap-2 mb-6">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign.name.toLowerCase()}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedSign === sign.name.toLowerCase()
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    }`}
                    onClick={() => setSelectedSign(sign.name.toLowerCase())}
                  >
                    {sign.name}
                  </button>
                ))}
              </div>

              {/* Horoscope Content */}
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="ml-2 h-6 w-48" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  <p>Failed to load horoscope. Please try again later.</p>
                </div>
              ) : !currentHoroscope ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No horoscope available for this date and sign. Please check back later.</p>
                </div>
              ) : (
                <div>
                  <HoroscopeSign sign={selectedSign} />
                  <p className="text-slate-600 mt-4">{currentHoroscope.content}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-slate-800 mb-4">About Zodiac Signs</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ZODIAC_SIGNS.map((sign) => (
                  <div key={sign.name} className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-xl font-bold text-primary-600">{sign.emoji}</span>
                      <h3 className="ml-2 text-md font-heading font-semibold text-slate-800">{sign.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{sign.dates}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Horoscope = () => {
  return (
    <AuthProvider>
      <HoroscopeContent />
    </AuthProvider>
  );
};

export default Horoscope;
