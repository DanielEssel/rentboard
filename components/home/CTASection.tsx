"use client"
import { motion } from "framer-motion"
import CTAButton from "@/components/CTAButton"

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

export default function CTASection() {
  return (
    <motion.section 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004a54] text-white text-center relative overflow-hidden" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <motion.div variants={fadeInUp} className="relative z-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to Find Your Perfect Place?
        </h2>
        <p className="text-sm sm:text-base sm:text-base md:text-lg text-gray-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Join thousands of satisfied tenants who found their homes through TownWrent
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <CTAButton href="/explore" variant="primary">Explore Homes</CTAButton>
          <CTAButton href="/list-property" variant="secondary">Post A Property</CTAButton>
        </div>
      </motion.div>
    </motion.section>
  )
}