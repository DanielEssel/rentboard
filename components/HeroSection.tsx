"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CTAButton from "./CTAButton";
import Image from "next/image";
import { Home, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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

  return (
    <motion.section
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 text-white overflow-hidden"
      initial="hidden"
      animate="visible"
      style={{ willChange: "auto" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/Mock1.jpg"
          alt="Rental properties hero"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#006D77]/40 to-black/60" />
      </div>

      {/* Floating Icons */}
      {isMounted && (
        <>
          <motion.div
            className="absolute top-16 left-10 opacity-40 hidden md:block"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Home className="h-12 w-12 text-[#FFD166]" />
          </motion.div>

          <motion.div
            className="absolute bottom-24 right-20 opacity-40 hidden md:block"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <UserCheck className="h-12 w-12 text-[#83C5BE]" />
          </motion.div>
        </>
      )}

      {/* Hero Title */}
      <motion.h1
        className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg"
        variants={fadeUp}
      >
        <span className="text-[#FFD166]">Find</span> Your Dream{" "}
        <span className="text-[#06D6A0]">Home</span> <br />
        With Ease & Confidence
      </motion.h1>

      {/* Hero Subtitle */}
      <motion.p
        className="text-lg sm:text-xl max-w-2xl mb-8 text-[#EDF6F9] font-medium leading-relaxed z-10"
        variants={fadeUp}
      >
        Discover verified rental properties across Awutu Bawjiase and beyond — secure, transparent, and stress-free.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 py-4 z-10"
        variants={fadeUp}
      >
        <motion.div className="flex" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <CTAButton  href="/explore" variant="primary" >
            Explore Rentals
          </CTAButton>
        </motion.div>

        <button
          onClick={handleListProperty}
          className="px-8 py-3 bg-white text-[#006D77] font-semibold rounded-lg shadow-lg hover:bg-[#EDF6F9] hover:scale-105 transition-all duration-300"
        >
          Post A Property
        </button>
      </motion.div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent -z-10" />
    </motion.section>
  );
}