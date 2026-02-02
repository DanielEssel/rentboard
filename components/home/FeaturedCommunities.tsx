"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin } from "lucide-react"

const featuredCommunities = [
  { name: "East Legon", properties: 45, image: "/communities/east-legon.jpg", href: "/explore?community=east-legon" },
  { name: "Tema", properties: 38, image: "/communities/tema.jpg", href: "/explore?community=tema" },
  { name: "Kumasi", properties: 52, image: "/communities/kumasi.jpg", href: "/explore?community=kumasi" },
  { name: "Takoradi", properties: 28, image: "/communities/takoradi.jpg", href: "/explore?community=takoradi" },
  { name: "Cape Coast", properties: 31, image: "/communities/cape-coast.jpg", href: "/explore?community=cape-coast" },
  { name: "Awutu Bawjiase", properties: 22, image: "/communities/bawjiase.jpg", href: "/explore?community=bawjiase" },
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

export default function FeaturedCommunities() {
  return (
    <motion.section 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Featured Communities
        </h2>
        <p className="text-sm sm:text-base sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Explore popular communities across Ghana with verified rental properties
        </p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto px-2"
      >
        {featuredCommunities.map((community, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Link 
              href={community.href}
              className="group block relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              <div className="aspect-square bg-gradient-to-br from-[#006D77] to-[#004a54] relative">
                {/* Placeholder for community image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#006D77]/80 to-[#004a54]/80 flex items-center justify-center">
                  <MapPin className="h-8 w-8 sm:h-10 md:h-12 w-10 md:w-12 text-white/60" />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 group-active:bg-black/30 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
                  <h3 className="font-bold text-xs sm:text-sm sm:text-base md:text-base lg:text-lg mb-0.5 sm:mb-1 line-clamp-1">
                    {community.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm sm:text-base text-gray-200">
                    {community.properties} properties
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}