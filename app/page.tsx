"use client"
import { motion } from "framer-motion"
import HeroSection from "@/components/HeroSection"
import PropertyCard from "@/components/PropertyCard"
import FeatureCard from "@/components/FeatureCard"
import Footer from "@/components/Footer"
import CTAButton from "@/components/CTAButton"
import { Home, UserCheck, CalendarCheck, ShieldCheck } from "lucide-react"
import Navbar from "@/components/Navbar"
import TestimonialCarousel from "@/components/Testimonial"
import StatsSection from "@/components/StatsSection"

/* Mock Data */
const featuredProperties = [
  { id: "1", title: "2-Bedroom Apartment in Bawjiase", price: 800, location: "Awutu Bawjiase", image: "/images/Mock4.jpg", views: 120, favorites: 8 },
  { id: "2", title: "Single Room near Central Market", price: 400, location: "Awutu Bawjiase", image: "/images/Mock2.jpg", views: 75, favorites: 3 },
  { id: "3", title: "Self-Contained Studio", price: 600, location: "Awutu Bawjiase", image: "/images/Mock3.jpg", views: 95, favorites: 5 },
]

const features = [
  { Icon: UserCheck, title: "Verified Listings Only", description: "Every property is checked by our agency for reliability." },
  { Icon: CalendarCheck, title: "Transparent Process", description: "Tenants and landlords know every step clearly." },
  { Icon: ShieldCheck, title: "Tenant Support", description: "We guide tenants throughout the renting process." },
  { Icon: Home, title: "Fast Turnaround", description: "Properties are listed and rented efficiently through our agency." },
]

// Shared animation variants - optimized to prevent layout shift
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

export default function LandingPage() {
  return (
    <main className="font-sans">
      <Navbar />
      <HeroSection />

      {/* Stats Section - moved up for impact */}
      <StatsSection />

      {/* How It Works Section */}
      <motion.section 
        className="py-20 px-6 bg-gray-50 text-gray-800 text-center" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-12" 
          variants={fadeInUp}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <FeatureCard Icon={Home} title="Browse Listings" description="Find verified rental homes near you with ease." />
          <FeatureCard Icon={CalendarCheck} title="Book Site Visit" description="Schedule guided property viewings through our agency." />
          <FeatureCard Icon={ShieldCheck} title="Rent Securely" description="Complete rentals safely with verified landlords." />
        </div>
      </motion.section>

      {/* Featured Properties */}
      <motion.section 
        className="py-20 px-6 text-gray-800" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-12 text-center" 
          variants={fadeInUp}
        >
          Featured Properties
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredProperties.map((prop) => <PropertyCard key={prop.id} property={prop} />)}
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section 
        className="py-20 px-6 bg-[#E0FBFC] text-gray-800 text-center" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-12" 
          variants={fadeInUp}
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => <FeatureCard key={i} Icon={f.Icon} title={f.title} description={f.description} />)}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-6 bg-[#173235] text-white text-center" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-6" 
          variants={fadeInUp}
        >
          Ready to find your perfect place?
        </motion.h2>
        <div className="flex justify-center gap-4">
          <CTAButton href="/explore" variant="primary">Explore Homes</CTAButton>
          <CTAButton href="/list-property" variant="secondary">Post A Property</CTAButton>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}