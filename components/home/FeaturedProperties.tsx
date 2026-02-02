"use client"
import { motion } from "framer-motion"
import PropertyCard from "@/components/PropertyCard"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getProperties, type Property } from "@/lib/properties"
import { supabase } from "@/lib/supabase/client"



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

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<(Property & { image: string; location: string })[]>([])
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
        // Fetch all properties
        const data = await getProperties()
        
        // Randomly select 3 properties to feature
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        const featuredProperties = shuffled.slice(0, 3).map(prop => ({
          ...prop,
          // Get the first image from property_images array
          image: prop.property_images?.[0]?.image_url 
            ? getValidImageUrl(prop.property_images[0].image_url)
            : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          location: `${prop.town}, ${prop.region}`,
        })) as (Property & { image: string; location: string })[]
        
        setProperties(featuredProperties)
      } catch (error) {
        console.error(
          "Failed to load featured properties:",
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
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 text-gray-800" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
    >
      <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Featured Properties</h2>
        <p className="text-sm sm:text-base sm:text-base text-gray-600 max-w-2xl mx-auto">
          Hand-picked premium properties with the best value and location
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
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {properties.map((prop) => (
            <motion.div key={prop.id} variants={fadeInUp}>
              <PropertyCard property= {prop} />
            </motion.div>   
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured properties available at the moment.</p>
        </div>
      )}
    </motion.section>
  )
}