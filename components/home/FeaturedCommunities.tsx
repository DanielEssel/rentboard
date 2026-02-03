"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

// Custom MapPin icon (no lucide-react)
const MapPinIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// Custom Arrow Icons
const ChevronLeftIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const featuredCommunities = [
  { 
    name: "East Legon", 
    properties: 45, 
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    href: "/explore?community=east-legon" 
  },
  { 
    name: "Tema", 
    properties: 38, 
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    href: "/explore?community=tema" 
  },
  { 
    name: "Kumasi", 
    properties: 52, 
    image: "https://images.unsplash.com/photo-1769321725396-fdb0ee42d605?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/explore?community=kumasi" 
  },
  { 
    name: "Takoradi", 
    properties: 28, 
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    href: "/explore?community=takoradi" 
  },
  { 
    name: "Cape Coast", 
    properties: 31, 
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
    href: "/explore?community=cape-coast" 
  },
  { 
    name: "Awutu Bawjiase", 
    properties: 22, 
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80",
    href: "/explore?community=bawjiase" 
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

export default function FeaturedCommunities() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      })
    }
  }

  return (
    <motion.section 
      className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Featured Communities
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Explore popular communities across Ghana with verified rental properties
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredCommunities.map((community, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-36 sm:w-40 md:w-48 lg:w-52"
              >
                <Link 
                  href={community.href}
                  className="group/card block relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105"
                >
                  <div className="aspect-square relative">
                    {/* Community Image */}
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 208px"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover/card:from-black/60 group-hover/card:via-black/20 group-hover/card:to-transparent transition-all duration-300"></div>
                    
                    {/* MapPin Icon - visible on hover for larger screens */}
                    <div className="absolute top-3 right-3 opacity-0 sm:group-hover/card:opacity-100 transition-opacity duration-300">
                      <MapPinIcon className="h-5 w-5 md:h-6 md:w-6 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 line-clamp-1 drop-shadow-md">
                        {community.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-100 drop-shadow-md">
                        {community.properties} properties
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow - Hidden on mobile */}
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Scroll Hint for Mobile */}
        <p className="text-center text-xs text-gray-400 mt-4 sm:hidden">
          Swipe to see more communities →
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  )
}