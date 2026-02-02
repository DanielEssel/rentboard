"use client"
import { motion } from "framer-motion"
import FeatureCard from "@/components/FeatureCard"
import { Home, UserCheck, CalendarCheck, ShieldCheck } from "lucide-react"

const features = [
  { Icon: UserCheck, title: "Verified Listings Only", description: "Every property is checked by our agency for reliability." },
  { Icon: CalendarCheck, title: "Transparent Process", description: "Tenants and landlords know every step clearly." },
  { Icon: ShieldCheck, title: "Tenant Support", description: "We guide tenants throughout the renting process." },
  { Icon: Home, title: "Fast Turnaround", description: "Properties are listed and rented efficiently through our agency." },
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function WhyChooseUs() {
  return (
    <motion.section 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#E0FBFC] text-gray-800 text-center" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <motion.div variants={fadeInUp} className="mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose TownWrent</h2>
        <p className="text-sm sm:text-base sm:text-base text-gray-600 max-w-2xl mx-auto">
          We make finding and renting properties simple, secure, and stress-free
        </p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <FeatureCard Icon={f.Icon} title={f.title} description={f.description} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}