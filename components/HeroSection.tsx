"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { MapPin, Search, FileText, House } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

export default function HeroSection() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // Fix hydration mismatch
  useState(() => {
    setIsMounted(true);
  });

  const handleListProperty = async () => {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect guest to login with return path
      router.push("/list-property");
      return;
    }

    // Authenticated → go to listing page
    router.push("/list-property");
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      router.push(`/explore?location=${encodeURIComponent(searchLocation)}`);
    }
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004a54] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("/images/mock2.jpg")`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Find Accommodation
            <span className="block text-[#FFD166] mt-1 sm:mt-2">Without Stress</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Discover verified properties across Ghana. Connect with trusted landlords and find your perfect home today.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="relative group">
              <MapPin className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-focus-within:text-[#006D77] transition-colors" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter location (e.g., East Legon, Tema...)"
                className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl 
                         border-2 border-white/20 focus:border-[#FFD166] focus:outline-none 
                         focus:ring-4 focus:ring-[#FFD166]/30 transition-all bg-white/95 
                         backdrop-blur-sm placeholder:text-gray-500 text-gray-800 
                         text-sm sm:text-base font-medium shadow-2xl"
              />
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 mb-8 sm:mb-12">
            <Link
              href="/explore"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FFD166] text-[#006D77] font-bold 
                       rounded-lg sm:rounded-xl hover:bg-[#ffc940] hover:shadow-2xl 
                       hover:scale-105 transition-all duration-300 flex items-center 
                       justify-center gap-2 text-sm sm:text-base"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Browse Properties
            </Link>
            <Link
              href="/request"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white 
                       font-bold rounded-lg sm:rounded-xl border-2 border-white/30 
                       hover:bg-white/20 hover:shadow-2xl hover:scale-105 transition-all 
                       duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <House className="h-4 w-4 sm:h-5 sm:w-5" />
              Request a room
            </Link>
            <Link
              href="/list-property"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FFD166] text-[#006D77] font-bold 
                       rounded-lg sm:rounded-xl hover:bg-[#ffc940] hover:shadow-2xl 
                       hover:scale-105 transition-all duration-300 flex items-center 
                       justify-center gap-2 text-sm sm:text-base"
            >
              <House className="h-4 w-4 sm:h-5 sm:w-5" />
              Post a Property
            </Link>
          </div>

          
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}