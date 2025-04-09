import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ZODIAC_SIGNS } from "@/lib/constants";
import HoroscopeSign from "@/components/common/HoroscopeSign";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HoroscopePreview = () => {
  const [selectedSign, setSelectedSign] = useState("aries");
  const today = format(new Date(), "yyyy-MM-dd");

  const { data, isLoading, error } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: [`/api/horoscopes`, { date: today }],
  });

  // Debug to see what's coming from the server
  console.log("Horoscope API response:", data);

  const horoscopes = data?.data || [];
  console.log("Parsed horoscopes:", horoscopes);
  
  const currentHoroscope = horoscopes.find(h => {
    // Debug each horoscope to see what we're searching through
    console.log("Checking horoscope:", h, "against selected sign:", selectedSign);
    return h.sign?.toLowerCase() === selectedSign.toLowerCase();
  });

  return (
    <div id="horoscope" className="lg:w-1/2">
      <h2 className="text-2xl font-heading font-bold text-slate-800">Today's Horoscope</h2>
      <p className="mt-2 text-slate-600">Find guidance in the celestial wisdom of your daily horoscope.</p>
      
      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {/* Horoscope Sign Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ZODIAC_SIGNS.slice(0, 5).map((sign) => (
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
            <Link href="/horoscope">
              <button className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                All Signs →
              </button>
            </Link>
          </div>
          
          {/* Current Horoscope Content */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="ml-2 h-6 w-48" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>Failed to load horoscope. Please try again later.</p>
            </div>
          ) : !currentHoroscope ? (
            <div className="text-center text-gray-500 py-4">
              <p>No horoscope available today. Please check back later.</p>
            </div>
          ) : (
            <div>
              <HoroscopeSign sign={selectedSign} />
              <p className="text-slate-600 mt-4">{currentHoroscope.content}</p>
            </div>
          )}
          
          {/* Date Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Link href="/horoscope">
              <Button variant="link" size="sm" className="text-sm text-primary-600 hover:text-primary-700 font-medium p-0">
                <ChevronLeft className="h-4 w-4 mr-1" />
                View Previous
              </Button>
            </Link>
            <span className="text-sm font-medium text-slate-700">{format(new Date(), "MMMM d, yyyy")}</span>
            <Link href="/horoscope">
              <Button variant="link" size="sm" className="text-sm text-primary-600 hover:text-primary-700 font-medium p-0">
                Full Horoscope
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoroscopePreview;
