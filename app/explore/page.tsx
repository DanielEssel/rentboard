"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Search, Home, BedDouble, BadgeCheck, SlidersHorizontal, X } from "lucide-react"
import Footer from "@/components/Footer"
import Link from "next/link"
import Image from "next/image"

type Property = {
  id: number
  title: string
  location: string
  price: string
  image: string
  type: string
  verified?: boolean
  bedrooms?: number
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "2-Bed Apartment at Awutu Bawjiase",
    location: "Awutu Bawjiase",
    price: "₵800 / month",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    type: "Apartment",
    verified: true,
    bedrooms: 2,
  },
  {
    id: 2,
    title: "Single Room Self Contained at Kasoa",
    location: "Kasoa",
    price: "₵450 / month",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
    type: "Single Room",
    verified: true,
    bedrooms: 1,
  },
  {
    id: 3,
    title: "3-Bed House at Nyanyano",
    location: "Nyanyano",
    price: "₵1,200 / month",
    image: "https://images.unsplash.com/photo-1599423300746-b62533397364",
    type: "House",
    verified: false,
    bedrooms: 3,
  },
]

export default function ExplorePage() {
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<Property[]>(mockProperties)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [priceRange, setPriceRange] = useState<string>("all")
  const [propertyType, setPropertyType] = useState<string>("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [bedroomCount, setBedroomCount] = useState<string>("all")

  const handleSearch = () => {
    let results = mockProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    )

    // Apply filters
    if (propertyType !== "all") {
      results = results.filter((p) => p.type === propertyType)
    }

    if (verifiedOnly) {
      results = results.filter((p) => p.verified)
    }

    if (bedroomCount !== "all") {
      results = results.filter((p) => p.bedrooms === Number(bedroomCount))
    }

    if (priceRange !== "all") {
      results = results.filter((p) => {
        const price = parseInt(p.price.replace(/[^\d]/g, ""))
        switch (priceRange) {
          case "low":
            return price < 500
          case "medium":
            return price >= 500 && price < 1000
          case "high":
            return price >= 1000
          default:
            return true
        }
      })
    }

    setFiltered(results)
  }

  const clearFilters = () => {
    setPriceRange("all")
    setPropertyType("all")
    setVerifiedOnly(false)
    setBedroomCount("all")
    setSearch("")
    setFiltered(mockProperties)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Switch Role */}
      <div className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Link href="/" className="text-xl font-bold text-[#006D77]">
        <Image
          src="/logos/wrent1.png"
          alt="Wrent Logo"
          width={55}
          height={55}
          className="object-contain"
        />
      </Link>
    </div>
    <button
      onClick={() => {
        localStorage.removeItem("userRole");
        window.location.href = "/select-user";
      }}
      className="text-sm text-gray-600 hover:text-[#006D77] font-medium transition-colors"
    >
      Switch Role
    </button>
  </div>
</div>


      {/* Hero / Search */}
      <section className="relative bg-[#006D77] text-white py-16 px-6 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-3">
            Find Verified Rentals Near You
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Browse verified homes and book a site visit today.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto flex gap-3 flex-col sm:flex-row mb-4">
            <div className="relative flex-1 bg-white rounded-xl">
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter location or property type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-3 py-3 w-full rounded-xl text-gray-800 focus:ring-2 focus:ring-[#FFD166] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#FFD166] text-[#006D77] font-semibold px-6 py-3 rounded-xl hover:bg-[#ffc940] transition-colors"
            >
              <Search className="inline-block mr-2 h-4 w-4" />
              Search
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-white hover:text-[#FFD166] transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </section>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white border-b shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filter Properties
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-[#006D77] hover:text-[#005662] font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Single Room">Single Room</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under ₵500</option>
                  <option value="medium">₵500 - ₵1,000</option>
                  <option value="high">Over ₵1,000</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedroomCount}
                  onChange={(e) => setBedroomCount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006D77] focus:outline-none"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                </select>
              </div>

              {/* Verified Only */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-[#006D77] border-gray-300 rounded focus:ring-[#006D77]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Verified Only
                  </span>
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                </label>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="mt-4 w-full sm:w-auto bg-[#006D77] text-white font-medium px-8 py-2 rounded-lg hover:bg-[#005662] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Property Listings */}
      <main className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Available Properties ({filtered.length})
          </h2>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((property) => (
              <Link 
                key={property.id}
                href={`/property/${property.id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: property.id * 0.1 }}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {property.verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-[#006D77] transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {property.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-[#006D77] text-lg">{property.price}</p>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {property.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <BedDouble className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">No properties found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#006D77] hover:text-[#005662] font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}