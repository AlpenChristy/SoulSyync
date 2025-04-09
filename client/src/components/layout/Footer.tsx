import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import img from "@/logo.png";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary-600 font-heading font-bold"></span>
                <img src={img}></img>
              </div>
              <span className="ml-2 text-xl font-heading font-semibold">SoulSyync</span>
            </Link>
            <p className="mt-4 text-slate-300">
              Your journey to spiritual wellness begins here. Find peace, purpose, and transformation through our guidance.
            </p>
            <div className="mt-6 flex space-x-4">
              <button className="text-slate-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </button>
              <button className="text-slate-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </button>
              <button className="text-slate-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-white">Services</Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link href="/horoscope" className="text-slate-300 hover:text-white">Horoscope</Link>
              </li>
              <li>
                <Link href="/booking" className="text-slate-300 hover:text-white">Book a Session</Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services#spiritual-counseling" className="text-slate-300 hover:text-white">
                  Spiritual Counseling
                </Link>
              </li>
              <li>
                <Link href="/services#chakra-balancing" className="text-slate-300 hover:text-white">
                  Chakra Balancing
                </Link>
              </li>
              <li>
                <Link href="/services#aura-cleansing" className="text-slate-300 hover:text-white">
                  Aura Cleansing
                </Link>
              </li>
              <li>
                <Link href="/services#meditation-guidance" className="text-slate-300 hover:text-white">
                  Meditation Guidance
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-slate-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-300">Vadodara<br/>B105, Gokul Township Near<br/>Harmony, CA 90210<br/>Rameshwar Vidhyalay, Gotri Road</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-slate-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <button onClick={() => window.location.href = 'mailto:info@maaecounselling.com'} className="text-slate-300 hover:text-white">info@maaecounselling.com</button>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-slate-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <button onClick={() => window.location.href = 'tel:+1234567890'} className="text-slate-300 hover:text-white">+91 81609 45602</button>
              </li>
            </ul>
            
            <h3 className="mt-8 text-lg font-heading font-semibold">Business Hours</h3>
            <p className="mt-2 text-slate-300">
              Monday - Friday: 9am - 6pm<br/>
              Saturday: 10am - 4pm<br/>
              Sunday: Closed
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-center">&copy; {new Date().getFullYear()} SoulSyync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
