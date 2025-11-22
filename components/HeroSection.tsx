"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CTAButton from "./CTAButton"
import Image from "next/image"
import { Home, UserCheck, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
}

export default function HeroSection() {
  const router = useRouter()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const handleListProperty = async () => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Show authentication prompt
      setShowAuthPrompt(true)
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShowAuthPrompt(false), 5000)
    } else {
      // User is authenticated, proceed to list property
      router.push('/list-property')
    }
  }

  const handleSignIn = () => {
    // Redirect to sign-in page with return URL
    router.push('/auth/login?returnTo=/list-property')
  }

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

      {/* Authentication Prompt Modal */}
      {showAuthPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white text-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#FFD166]/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[#006D77]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg text-[#006D77] mb-2">
                Sign In Required
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You need to be signed in to list a property. Create an account or sign in to continue.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSignIn}
                  className="flex-1 bg-[#006D77] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005662] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAuthPrompt(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Backdrop for modal */}
      {showAuthPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthPrompt(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

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
        <button
          onClick={handleListProperty}
          className="px-8 py-3 bg-white text-[#006D77] font-semibold rounded-lg shadow-lg hover:bg-[#EDF6F9] hover:scale-105 transition-all duration-300"
        >
          List a Property
        </button>
      </motion.div>

      {/* Subtle gradient overlay at bottom for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent -z-10" />
    </motion.section>
  )
}