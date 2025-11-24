"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CTAButton from "./CTAButton"
import Image from "next/image"
import { Home, UserCheck, AlertCircle, X, LogIn, UserPlus } from "lucide-react"
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
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration issues
  useState(() => {
    setIsMounted(true)
  })

  const handleListProperty = async () => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Show authentication prompt
      setShowAuthPrompt(true)
    } else {
      // User is authenticated, proceed to list property
      router.push('/list-property')
    }
  }

  const handleSignIn = () => {
    // Redirect to sign-in page with return URL
    router.push('/auth/login?returnTo=/list-property')
  }

  const handleSignUp = () => {
    // Redirect to sign-up page with return URL
    router.push('/auth/signup?returnTo=/list-property')
  }

  return (
    <motion.section
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 text-white overflow-hidden"
      initial="hidden"
      animate="visible"
      style={{ willChange: 'auto' }}
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

      {/* Floating Decorative Icons - Only animate after mount */}
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

      {/* Authentication Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthPrompt(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              style={{ position: 'fixed' }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] sm:w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#006D77] to-[#005662] px-4 sm:px-6 py-4 sm:py-5 relative">
                  <div className="flex items-center gap-2 sm:gap-3 text-white">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-base sm:text-lg">Authentication Required</h3>
                      <p className="text-teal-100 text-xs sm:text-sm hidden sm:block">Please sign in to continue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    To list a property on TownWrent, you need to create an account or sign in.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <button
                      onClick={handleSignIn}
                      className="w-full bg-[#006D77] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-[#005662] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group text-sm sm:text-base"
                    >
                      <LogIn className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                      Sign In
                    </button>
                    
                    <button
                      onClick={handleSignUp}
                      className="w-full bg-white text-[#006D77] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold border-2 border-[#006D77] hover:bg-[#006D77] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
                    >
                      <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                      Create Account
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500 font-medium">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors text-xs sm:text-sm py-2"
                  >
                    Continue Browsing
                  </button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="text-[#006D77] hover:underline font-medium">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#006D77] hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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