"use client"

import { motion } from "framer-motion"
import CTAButton from "./CTAButton"
import Image from "next/image"
import { Home, UserCheck } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
}

export default function HeroSection() {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 text-white overflow-hidden"
      initial="hidden"
      animate="visible"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/Mock1.jpg"
          alt="Rental properties hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#006D77]/40 to-black/60" />
      </div>

      {/* Floating Decorative Icons */}
      <motion.div
        className="absolute top-16 left-10 opacity-40"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Home className="h-12 w-12 text-[#FFD166]" />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-20 opacity-40"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <UserCheck className="h-12 w-12 text-[#83C5BE]" />
      </motion.div>

      {/* Hero Content */}
      <motion.h1
        className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg"
        variants={fadeUp}
      >
        <span className="text-[#FFD166]">Find</span> Your Dream{" "}
        <span className="text-[#06D6A0]">Home</span> <br />
        With Ease & Confidence
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl max-w-2xl mb-8 text-[#EDF6F9] font-medium leading-relaxed z-10"
        variants={fadeUp}
      >
        Discover verified rental properties across Awutu Bawjiase and beyond — secure, transparent, and stress-free.
      </motion.p>

      {/* Call-to-Action Buttons */}
      <motion.div className="flex flex-wrap justify-center gap-4 z-10" variants={fadeUp}>
        <CTAButton href="/explore" variant="primary">
          Explore Homes
        </CTAButton>
        <CTAButton href="/list-property" variant="secondary">
          List a Property
        </CTAButton>
      </motion.div>

      {/* Subtle gradient overlay at bottom for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent -z-10" />
    </motion.section>
  )
}
