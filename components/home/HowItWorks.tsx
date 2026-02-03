"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Variants } from "framer-motion";
import { useState } from "react";


const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};


export const scaleFade: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const howItWorksSteps = [
  { 
    title: "Browse Listings", 
    description: "Search verified rental properties across Ghana. Filter by location, price, and amenities to find your perfect match.",
    step: "01",
    image: "/how-it-works/browse.png",
    color: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  { 
    title: "Request Custom Search", 
    description: "Can't find what you're looking for? Fill out a simple form with your requirements and we'll find matching properties for you.",
    step: "02",
    image: "/how-it-works/request.png",
    color: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    isAlternative: true
  },
  { 
    title: "Book Site Visit", 
    description: "Schedule guided property viewings through our agency. We arrange everything for you and ensure a seamless experience.",
    step: "03",
    image: "/how-it-works/book.png",
    color: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  { 
    title: "Rent Securely", 
    description: "Complete rentals safely with verified landlords. We ensure a smooth transition and secure documentation process.",
    step: "04",
    image: "/how-it-works/rent.png",
    color: "from-green-500 to-emerald-500",
    iconBg: "bg-green-50",
    iconColor: "text-green-600"
  },
]



const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Image component with error handling
function StepImage({ src, alt, color }: { src: string, alt: string, color: string }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    // Fallback gradient background if image fails to load
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30 flex items-center justify-center`}>
        <div className="text-white text-6xl font-bold opacity-20">
          {alt.charAt(0)}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover group-hover:scale-110 transition-transform duration-700"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setImageError(true)}
    />
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#FFD166]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-[#006D77]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div 
            variants={scaleFade}
            className="inline-block mb-3 sm:mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#006D77]/10 text-[#006D77] rounded-full text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 bg-[#006D77] rounded-full animate-pulse"></span>
              Simple Process
            </span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent px-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Finding your perfect home is easy with our flexible process. 
            Browse listings or request a custom search - we've streamlined everything to make your rental experience seamless.
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-5 xl:gap-6"
        >
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative group"
            >
              {/* Connector Arrow - Desktop Only */}
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 -right-2 xl:-right-3 z-20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#FFD166] opacity-60">
                    <path d="M5 12h14M14 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Mobile Connector - Shows between cards on mobile */}
              {index < howItWorksSteps.length - 1 && (
                <div className="sm:hidden absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#FFD166] opacity-60 rotate-90">
                    <path d="M5 12h14M14 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Alternative Step Badge */}
              {step.isAlternative && (
                <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-30">
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg">
                    <span>★</span> Optional
                  </span>
                </div>
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                {/* Step Number Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:top-6 lg:right-6 z-20">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{step.step}</span>
                  </div>
                </div>

                {/* Image Section */}
                <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 overflow-hidden bg-gray-100">
                  <StepImage src={step.image} alt={step.title} color={step.color} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 md:p-7 lg:p-8">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${step.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${step.iconColor} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8`}>
                      {index === 0 && (
                        <>
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-900 group-hover:text-[#006D77] transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative Bottom Border */}
                  <div className={`mt-4 sm:mt-5 md:mt-6 h-0.5 sm:h-1 w-12 sm:w-16 rounded-full bg-gradient-to-r ${step.color} group-hover:w-full transition-all duration-500`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10 sm:mt-12 md:mt-16 lg:mt-20"
        >
          <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-4">
            Ready to find your dream home?
          </p>
          <button className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#006D77] to-[#005662] text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}