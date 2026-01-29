"use client"
import { motion } from "framer-motion"
import HeroSection from "@/components/HeroSection"
import PropertyCard from "@/components/PropertyCard"
import FeatureCard from "@/components/FeatureCard"
import Footer from "@/components/Footer"
import CTAButton from "@/components/CTAButton"
import { Home, UserCheck, CalendarCheck, ShieldCheck, MapPin, Search, FileText } from "lucide-react"
import Navbar from "@/components/Navbar"
import TestimonialCarousel from "@/components/Testimonial"
import StatsSection from "@/components/StatsSection"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import TopHeader from "@/components/TopHeader"

/* Mock Data */
const featuredProperties = [
  { id: "1", title: "2-Bedroom Apartment in Bawjiase", price: 800, location: "Awutu Bawjiase", image: "/images/Mock4.jpg", views: 120, favorites: 8 },
  { id: "2", title: "Single Room near Central Market", price: 400, location: "Awutu Bawjiase", image: "/images/Mock2.jpg", views: 75, favorites: 3 },
  { id: "3", title: "Self-Contained Studio", price: 600, location: "Awutu Bawjiase", image: "/images/Mock3.jpg", views: 95, favorites: 5 },
]

const recentProperties = [
  { id: "4", title: "Modern 3-Bedroom House", price: 1200, location: "East Legon", image: "/images/Mock1.jpg", views: 180, favorites: 15, isNew: true },
  { id: "5", title: "Affordable Chamber & Hall", price: 350, location: "Tema Community 1", image: "/images/Mock2.jpg", views: 90, favorites: 6, isNew: true },
  { id: "6", title: "Executive Apartment", price: 950, location: "Kumasi", image: "/images/Mock3.jpg", views: 145, favorites: 12, isNew: true },
  { id: "7", title: "Cozy Single Room", price: 300, location: "Cape Coast", image: "/images/Mock4.jpg", views: 65, favorites: 4, isNew: true },
]

const featuredCommunities = [
  { name: "East Legon", properties: 45, image: "/communities/east-legon.jpg", href: "/explore?community=east-legon" },
  { name: "Tema", properties: 38, image: "/communities/tema.jpg", href: "/explore?community=tema" },
  { name: "Kumasi", properties: 52, image: "/communities/kumasi.jpg", href: "/explore?community=kumasi" },
  { name: "Takoradi", properties: 28, image: "/communities/takoradi.jpg", href: "/explore?community=takoradi" },
  { name: "Cape Coast", properties: 31, image: "/communities/cape-coast.jpg", href: "/explore?community=cape-coast" },
  { name: "Awutu Bawjiase", properties: 22, image: "/communities/bawjiase.jpg", href: "/explore?community=bawjiase" },
]

const features = [
  { Icon: UserCheck, title: "Verified Listings Only", description: "Every property is checked by our agency for reliability." },
  { Icon: CalendarCheck, title: "Transparent Process", description: "Tenants and landlords know every step clearly." },
  { Icon: ShieldCheck, title: "Tenant Support", description: "We guide tenants throughout the renting process." },
  { Icon: Home, title: "Fast Turnaround", description: "Properties are listed and rented efficiently through our agency." },
]

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

// Shared animation variants
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

export default function LandingPage() {
  const [searchLocation, setSearchLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchLocation.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchLocation.trim())}`)
    }
  }

  return (
    <main className="font-sans ">
      <TopHeader />
      <div className=""> 
          <Navbar />
      </div>
    
      
      {/* Enhanced Hero Section */}
      <div className="relative">
        <HeroSection />
      </div>
      

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Communities Section */}
      <motion.section 
        className="py-20 px-6 bg-white" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Featured Communities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore popular communities across Ghana with verified rental properties
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto"
        >
          {featuredCommunities.map((community, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Link 
                href={community.href}
                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-gradient-to-br from-[#006D77] to-[#004a54] relative">
                  {/* Placeholder for community image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#006D77]/80 to-[#004a54]/80 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white/60" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-bold text-base sm:text-lg mb-1">{community.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-200">
                      {community.properties} properties
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* How It Works Section - Enhanced */}
      <motion.section 
        className="py-20 px-6 bg-gray-50 text-gray-800" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding your perfect home is easy with our simple 3-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#FFD166] to-[#ffc940] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-[#006D77]">{step.step}</span>
              </div>

              {/* Card */}
              <div className="bg-white p-8 pt-10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full border-2 border-gray-100 group-hover:border-[#006D77]/20">
                <div className="w-14 h-14 bg-[#006D77]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#006D77] transition-colors duration-300">
                  <step.Icon className="h-7 w-7 text-[#006D77] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
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

      {/* Recently Listed Properties */}
      <motion.section 
        className="py-20 px-6 bg-white text-gray-800" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Recently Listed Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fresh listings added daily. Be the first to discover your next home
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {recentProperties.map((prop) => (
            <motion.div key={prop.id} variants={fadeInUp}>
              <PropertyCard property={prop} />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#006D77] text-white font-semibold rounded-xl hover:bg-[#005662] hover:shadow-lg transition-all duration-300"
          >
            View All Properties
            <Search className="h-5 w-5" />
          </Link>
        </div>
      </motion.section>

      {/* Featured Properties */}
      <motion.section 
        className="py-20 px-6 bg-gray-50 text-gray-800" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hand-picked premium properties with the best value and location
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {featuredProperties.map((prop) => (
            <motion.div key={prop.id} variants={fadeInUp}>
              <PropertyCard property={prop} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section 
        className="py-20 px-6 bg-[#E0FBFC] text-gray-800 text-center" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        <motion.div variants={fadeInUp} className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose TownWrent</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make finding and renting properties simple, secure, and stress-free
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <FeatureCard Icon={f.Icon} title={f.title} description={f.description} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004a54] text-white text-center relative overflow-hidden" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <motion.div variants={fadeInUp} className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Place?
          </h2>
          <p className="text-gray-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied tenants who found their homes through TownWrent
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <CTAButton href="/explore" variant="primary">Explore Homes</CTAButton>
            <CTAButton href="/list-property" variant="secondary">Post A Property</CTAButton>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </main>
  )
}