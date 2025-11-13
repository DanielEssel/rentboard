"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#006D77] via-[#83C5BE] to-[#EDF6F9] relative overflow-hidden">
      {/* Animated background image overlay */}
      <Image
        src="/images/hero-bg.jpg"
        alt="background"
        fill
        className="object-cover opacity-20 blur-sm"
      />

      {/* Floating light overlay animation */}
      <motion.div
        className="absolute inset-0 bg-white/10 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-[90%] max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-6">RentConnect</h1>
        {children}
      </motion.div>
    </div>
  )
}
