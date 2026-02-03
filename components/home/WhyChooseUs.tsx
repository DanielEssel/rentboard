"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Home, UserCheck, CalendarCheck, ShieldCheck, ArrowRight, X } from "lucide-react"
import { Variants, cubicBezier } from "framer-motion";

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
      ease: cubicBezier(0.6, -0.05, 0.01, 0.99),
    },
  },
};



const features = [
  { 
    Icon: UserCheck, 
    title: "Verified Listings", 
    description: "Every property is thoroughly checked by our agency to ensure reliability and authenticity. Trust in quality listings.",
    link: "#verified-listings"
  },
  { 
    Icon: CalendarCheck, 
    title: "Transparent Process", 
    description: "Clear communication at every step. Both tenants and landlords know exactly what to expect throughout the rental journey.",
    link: "#transparent-process"
  },
  { 
    Icon: ShieldCheck, 
    title: "Tenant Support", 
    description: "Dedicated support team guiding you through documentation, viewings, and move-in. We're here for you.",
    link: "#tenant-support"
  },
  { 
    Icon: Home, 
    title: "Fast Turnaround", 
    description: "Properties are listed and rented efficiently through our streamlined process. Find your home faster.",
    link: "#fast-turnaround"
  },
]



const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

// Enhanced Feature Card with Click/Hover Toggle
function RevealFeatureCard({ Icon, title, description, link, index }: { 
  Icon: any, 
  title: string, 
  description: string,
  link: string,
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Desktop: Hover Effect */}
      <div className="hidden lg:block group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#3D5A80]/30 h-[280px] cursor-pointer">
        {/* Card Content Container */}
        <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
          
          {/* Icon Container */}
          <div className="relative z-10 mb-6">
            <div className="relative">
              {/* Icon Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3D5A80] to-[#EE6C4D] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3D5A80] to-[#293241] text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon className="w-10 h-10" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#3D5A80] transition-colors duration-300">
            {title}
          </h3>
          
          {/* Subtitle */}
          <p className="relative z-10 text-sm text-gray-500 group-hover:opacity-0 transition-opacity duration-300">
            Hover to learn more
          </p>

          {/* Sliding Description Overlay - SOLID BACKGROUND */}
          <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-[65%] bg-[#3D5A80] transition-all duration-500 ease-out rounded-t-3xl shadow-2xl">
            <div className="h-full flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              
              {/* Description Text */}
              <p className="text-white text-base leading-relaxed mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                {description}
              </p>
              
              {/* Read More Link */}
              <a 
                href={link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#EE6C4D] transition-colors duration-200 group/link transform translate-y-4 group-hover:translate-y-0 delay-200"
              >
                Learn more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          {/* Decorative Corner Element */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#EE6C4D]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Mobile/Tablet: Click to Expand */}
      <div className="lg:hidden">
        <div 
          onClick={handleToggle}
          className={`relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-lg transition-all duration-500 border-2 cursor-pointer ${
            isOpen 
              ? 'border-[#3D5A80] shadow-2xl' 
              : 'border-gray-100 active:scale-95'
          } h-[280px]`}
        >
          {/* Card Content Container */}
          <div className="relative h-full p-6 flex flex-col items-center justify-center text-center">
            
            {/* Icon Container */}
            <div className={`relative z-10 mb-4 transition-all duration-500 ${isOpen ? 'scale-90 -translate-y-2' : ''}`}>
              <div className="relative">
                {/* Icon Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#3D5A80] to-[#EE6C4D] rounded-2xl blur-xl opacity-20 transition-opacity duration-500 ${isOpen ? 'opacity-40' : ''}`} />
                
                {/* Icon */}
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D5A80] to-[#293241] text-white transition-all duration-500 shadow-lg ${isOpen ? 'scale-110 rotate-6' : ''}`}>
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h3 className={`relative z-10 text-xl font-bold mb-2 transition-all duration-300 ${isOpen ? 'text-[#3D5A80]' : 'text-gray-900'}`}>
              {title}
            </h3>
            
            {/* Tap to learn more */}
            <p className={`relative z-10 text-sm text-gray-500 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
              Tap to learn more
            </p>

            {/* Sliding Description Overlay - SOLID BACKGROUND */}
            <div className={`absolute inset-x-0 bottom-0 bg-[#3D5A80] transition-all duration-500 ease-out rounded-t-3xl shadow-2xl ${
              isOpen ? 'h-[65%]' : 'h-0'
            }`}>
              <div className={`h-full flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
                isOpen ? 'opacity-100 delay-100' : 'opacity-0'
              }`}>
                
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Description Text */}
                <p className={`text-white text-sm leading-relaxed mb-4 transition-transform duration-500 ${
                  isOpen ? 'translate-y-0 delay-150' : 'translate-y-4'
                }`}>
                  {description}
                </p>
                
                {/* Read More Link */}
                <a 
                  href={link}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#EE6C4D] transition-all duration-200 group/link ${
                    isOpen ? 'translate-y-0 delay-200' : 'translate-y-4'
                  }`}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>

            {/* Decorative Corner Element */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#EE6C4D]/10 to-transparent rounded-bl-full transition-opacity duration-500 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
        </div>
      </div>
    </>
  )
}

export default function WhyChooseUs() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#E0FBFC] to-[#d0f5f7] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-[#98C1D9] rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#3D5A80] rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <motion.div 
        className="relative max-w-7xl mx-auto"
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px", amount: 0.2 }}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3 sm:mb-4"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#3D5A80] to-[#293241] text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
              Why Choose Us
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-900 leading-tight px-4">
            Why Choose{" "}
            <span className="text-[#3D5A80] relative inline-block">
              TownWrent
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#EE6C4D] to-[#EE6C4D]/50 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            We make finding and renting properties simple, secure, and stress-free
          </p>
        </motion.div>

        {/* Grid Layout - All Breakpoints */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              className="w-full"
            >
              <RevealFeatureCard 
                Icon={feature.Icon} 
                title={feature.title} 
                description={feature.description}
                link={feature.link}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}