import { ZODIAC_SIGNS } from "@/lib/constants";

interface HoroscopeSignProps {
  sign: string;
}

const HoroscopeSign = ({ sign }: HoroscopeSignProps) => {
  // Find the zodiac sign data
  const zodiacData = ZODIAC_SIGNS.find(
    (zodiac) => zodiac.name.toLowerCase() === sign.toLowerCase()
  );
  
  if (!zodiacData) {
    return (
      <div className="flex items-center mb-2">
        <span className="text-xl font-bold text-primary-600">⚠️</span>
        <h3 className="ml-2 text-lg font-heading font-semibold text-slate-800">
          Unknown Sign
        </h3>
      </div>
    );
  }
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <span className="text-xl font-bold text-primary-600">{zodiacData.emoji}</span>
        <h3 className="ml-2 text-lg font-heading font-semibold text-slate-800">
          {zodiacData.name} <span className="text-sm text-slate-500">({zodiacData.dates})</span>
        </h3>
      </div>
    </div>
  );
};

export default HoroscopeSign;
