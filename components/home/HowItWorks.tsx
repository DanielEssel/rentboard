"use client"
import { motion } from "framer-motion"
import { Search, CalendarCheck, ShieldCheck } from "lucide-react"

const howItWorksSteps = [
  { 
    Icon: Search, 
    title: "Browse Listings", 
    description: "Search verified rental properties across Ghana. Filter by location, price, and amenities.",
    step: "01"
  },
  { 
    Icon: CalendarCheck, 
    title: "Book Site Visit", 
    description: "Schedule guided property viewings through our agency. We arrange everything for you.",
    step: "02"
  },
  { 
    Icon: ShieldCheck, 
    title: "Rent Securely", 
    description: "Complete rentals safely with verified landlords. We ensure a smooth transition.",
    step: "03"
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5
    } 
  }
}

export default function HowItWorks() {
  return (
    <motion.section 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 text-gray-800" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
        <p className="text-sm sm:text-base sm:text-base text-gray-600 max-w-2xl mx-auto">
          Finding your perfect home is easy with our simple 3-step process
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
        {howItWorksSteps.map((step, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="relative group"
          >
            {/* Step Number */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFD166] to-[#ffc940] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-105 transition-transform duration-300 z-10">
              <span className="text-xl sm:text-2xl font-bold text-[#006D77]">{step.step}</span>
            </div>

            {/* Card */}
            <div className="bg-white p-6 sm:p-8 pt-8 sm:pt-10 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 h-full border-2 border-gray-100 group-hover:border-[#006D77]/20">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#006D77]/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#006D77] transition-colors duration-300">
                <step.Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#006D77] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800">{step.title}</h3>
              <p className="text-sm sm:text-base sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Connector Line (hidden on mobile and last item) */}
            {index < howItWorksSteps.length - 1 && (
              <div className="hidden md:block absolute top-1/3 -right-6 lg:-right-12 w-6 lg:w-12 h-0.5 bg-gradient-to-r from-[#FFD166] to-[#ffc940]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFD166] rounded-full"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}