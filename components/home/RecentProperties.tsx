"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import PropertyCard from "@/components/PropertyCard"
import { Search, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getProperties, type Property } from "@/lib/properties"
import { supabase } from "@/lib/supabase/client"

interface ExtendedProperty extends Property {
  image: string
  location: string
  isNew: boolean
}

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

export default function RecentProperties() {
  const [properties, setProperties] = useState<ExtendedProperty[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to get valid image URL
  const getValidImageUrl = (imageUrl: string | undefined | null): string => {
    if (!imageUrl) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    
    if (imageUrl.startsWith("http")) return imageUrl
    
    try {
      const publicUrl = supabase.storage
        .from("property-images")
        .getPublicUrl(imageUrl).data.publicUrl
      return publicUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    } catch {
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // Fetch all properties and get the 4 most recent
        const data = await getProperties()
        
        // Take only the first 4 (already sorted by created_at DESC)
        const recentProperties = data.slice(0, 4).map(prop => ({
          ...prop,
          // Get the first image from property_images array
          image: prop.property_images?.[0]?.image_url 
            ? getValidImageUrl(prop.property_images[0].image_url)
            : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          location: `${prop.town}, ${prop.region}`,
          isNew: true,
        }))
        
        setProperties(recentProperties)
      } catch (error) {
        console.error(
          "Failed to load recent properties:",
          error instanceof Error ? error.message : error
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <motion.section 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white text-gray-800" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Recently Listed Properties</h2>
        <p className="text-sm sm:text-base sm:text-base text-gray-600 max-w-2xl mx-auto">
          Fresh listings added daily. Be the first to discover your next home
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-[#006D77] animate-spin" />
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <>
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto"
          >
            {properties.map((prop) => (
              <motion.div key={prop.id} variants={fadeInUp}>
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#006D77] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#005662] active:bg-[#004a54] hover:shadow-lg active:shadow-md transition-all duration-300 text-sm sm:text-base sm:text-base w-full sm:w-auto max-w-xs"
            >
              View All Properties
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No recent properties available at the moment.</p>
          <Link
            href="/list-property"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#006D77] text-white font-semibold rounded-lg hover:bg-[#005662] transition-all duration-300"
          >
            List Your Property
          </Link>
        </div>
      )}
    </motion.section>
  )
}