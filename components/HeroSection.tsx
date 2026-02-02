"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Search, House } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      router.push(`/explore?location=${encodeURIComponent(searchLocation)}`);
    }
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/Mock2.jpg"
          alt="TownRent housing background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006D77]/90 via-[#005662]/90 to-[#004a54]/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Find Accommodation
            <span className="block text-[#FFD166] mt-1 sm:mt-2">
              Without Stress
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
            Discover verified properties across Ghana. Connect with trusted
            landlords and find your perfect home today.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            <div className="relative group">
              <MapPin className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-focus-within:text-[#006D77]" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter location (e.g., East Legon, Tema...)"
                className="w-full pl-12 sm:pl-16 pr-4 py-4 sm:py-5 rounded-xl sm:rounded-2xl
                           border-2 border-white/20 focus:border-[#FFD166]
                           focus:outline-none focus:ring-4 focus:ring-[#FFD166]/30
                           transition-all bg-white/95 backdrop-blur-sm
                           placeholder:text-gray-500 text-gray-800 font-medium shadow-2xl"
              />
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Link
              href="/explore"
              className="
      px-3 py-2 text-sm sm:text-base
      sm:px-6 sm:py-4 sm:text-base
      bg-[#FFD166] text-[#006D77]
      font-semibold
      rounded-md sm:rounded-xl
      transition-all
      flex items-center justify-center gap-1.5 sm:gap-2
      hover:bg-[#ffc940] sm:hover:scale-105
    "
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Browse Properties
            </Link>

            <Link
              href="/request"
              className="
      px-3 py-2 text-sm sm:text-base
      sm:px-6 sm:py-4 sm:text-base
      bg-white/10 backdrop-blur-md text-white
      font-semibold
      rounded-md sm:rounded-xl
      border border-white/30
      transition-all
      flex items-center justify-center gap-1.5 sm:gap-2
      hover:bg-white/20 sm:hover:scale-105
    "
            >
              <House className="h-4 w-4 sm:h-5 sm:w-5" />
              Request a Room
            </Link>

            <Link
              href="/list-property"
              className="
      px-3 py-2 text-sm sm:text-base
      sm:px-6 sm:py-4 sm:text-base
      bg-[#FFD166] text-[#006D77]
      font-semibold
      rounded-md sm:rounded-xl
      transition-all
      flex items-center justify-center gap-1.5 sm:gap-2
      hover:bg-[#ffc940] sm:hover:scale-105
    "
            >
              <House className="h-4 w-4 sm:h-5 sm:w-5" />
              Post a Property
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
