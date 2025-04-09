import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import img from "@/yoga.jpg";

const Hero = () => {
  return (
    <section className="hero-pattern bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="lg:flex items-center">
          <div className="lg:w-1/2 lg:pr-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-800 leading-tight">
              Begin Your Journey of <span className="text-primary-600">Spiritual Healing</span> and Personal Growth
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Discover inner peace and transformation through our personalized spiritual counseling sessions, daily guidance, and holistic healing methods.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto">
                  Book a Session
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="mt-3 sm:mt-0 w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <img 
              className="rounded-lg shadow-xl" 
              src={img}
              alt="Spiritual counseling session" 
              width="600" 
              height="400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;