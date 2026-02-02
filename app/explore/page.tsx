"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  BedDouble,
  BadgeCheck,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3x3,
  List,
  TrendingUp,
  Heart,
  MessageSquare,
} from "lucide-react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProperties, Property } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase/client";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [priceRange, setPriceRange] = useState<string>("all");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [bedroomCount, setBedroomCount] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Helper function to get valid image URL
  const getValidImageUrl = (imageUrl: string | undefined | null): string => {
    if (!imageUrl)
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

    if (imageUrl.startsWith("http")) return imageUrl;

    try {
      const publicUrl = supabase.storage
        .from("property-images")
        .getPublicUrl(imageUrl).data.publicUrl;
      return (
        publicUrl ||
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      );
    } catch {
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data);
        setFiltered(data);
      } catch (error) {
        console.error(
          "Failed to load properties:",
          error instanceof Error ? error.message : error,
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSearch = () => {
    let results = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.region.toLowerCase().includes(search.toLowerCase()) ||
        p.town.toLowerCase().includes(search.toLowerCase()),
    );

    if (propertyType !== "all") {
      results = results.filter((p) => p.property_type === propertyType);
    }

    if (priceRange !== "all") {
      results = results.filter((p) => {
        const price = p.price;
        switch (priceRange) {
          case "low":
            return price < 500;
          case "medium":
            return price >= 500 && price < 1000;
          case "high":
            return price >= 1000;
          default:
            return true;
        }
      });
    }

    if (verifiedOnly) {
      results = results.filter((p) => (p as any).is_verified);
    }

    // Sorting
    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      results.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    setFiltered(results);
  };

  const clearFilters = () => {
    setPriceRange("all");
    setPropertyType("all");
    setVerifiedOnly(false);
    setBedroomCount("all");
    setSearch("");
    setSortBy("newest");
    setFiltered(properties);
  };

  const activeFilterCount = [
    priceRange !== "all",
    propertyType !== "all",
    verifiedOnly,
    bedroomCount !== "all",
    search !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004d56] text-white py-12 md:py-6 px-4 sm:px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FFD166]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-teal-200 text-sm sm:text-base mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Explore Properties</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
              Discover Your
              <span className="block text-[#FFD166]">Perfect Home</span>
            </h1>
            <p className="text-teal-100 mb-6 md:mb-10 text-sm sm:text-base sm:text-base md:text-lg max-w-2xl mx-auto">
              Browse verified properties across Ghana. Book site visits
              instantly.
            </p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location or property type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 pr-4 py-3 md:py-4 w-full rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFD166] bg-gray-50 sm:bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-[#FFD166] text-[#006D77] font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-[#ffc940] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-4 md:mt-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all px-3 md:px-4 py-2 rounded-full text-xs md:text-sm sm:text-base font-medium flex items-center gap-2 border border-white/20"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-[#FFD166] text-[#006D77] px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setVerifiedOnly(!verifiedOnly);
                    setTimeout(handleSearch, 100);
                  }}
                  className={`${
                    verifiedOnly
                      ? "bg-[#FFD166] text-[#006D77]"
                      : "bg-white/10 text-white border-white/20"
                  } backdrop-blur-sm hover:bg-[#FFD166] hover:text-[#006D77] transition-all px-3 md:px-4 py-2 rounded-full text-xs md:text-sm sm:text-base font-medium flex items-center gap-2 border`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  Verified
                </button>

                <Link
                  href="/request"
                  className="bg-[#FFD166] text-[#006D77] hover:bg-[#ffc940] transition-all px-3 md:px-4 py-2 rounded-full text-xs md:text-sm sm:text-base font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Property
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b shadow-lg overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                  <SlidersHorizontal className="w-5 h-5 text-[#006D77]" />
                  Advanced Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm sm:text-base text-[#006D77] hover:text-[#005662] font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none appearance-none bg-white transition-all"
                    >
                      <option value="all">All Types</option>
                      <option value="Apartment">🏢 Apartment</option>
                      <option value="Single Room">🚪 Single Room</option>
                      <option value="Self Contained">🏠 Self Contained</option>
                      <option value="Store">🏪 Store</option>
                      <option value="Office">💼 Office</option>
                      <option value="Other">📦 Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none appearance-none bg-white transition-all"
                    >
                      <option value="all">All Prices</option>
                      <option value="low">💰 Under ₵500</option>
                      <option value="medium">💵 ₵500 - ₵1,000</option>
                      <option value="high">💸 Over ₵1,000</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none appearance-none bg-white transition-all"
                    >
                      <option value="newest">🆕 Newest First</option>
                      <option value="popular">🔥 Most Popular</option>
                      <option value="price-low">📉 Price: Low to High</option>
                      <option value="price-high">📈 Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <div className="relative">
                    <select
                      value={bedroomCount}
                      onChange={(e) => setBedroomCount(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#006D77] focus:border-[#006D77] focus:outline-none appearance-none bg-white transition-all"
                    >
                      <option value="all">Any</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3+ Bedrooms</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="mt-6 w-full sm:w-auto bg-[#006D77] text-white font-semibold px-10 py-3 rounded-xl hover:bg-[#005662] transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Property Listings */}
      <main className="px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Available Properties
            </h2>
            <p className="text-gray-600">
              {filtered.length}{" "}
              {filtered.length === 1 ? "property" : "properties"} found
              {activeFilterCount > 0 &&
                ` with ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#006D77] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#006D77] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 md:py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-16 w-16 border-4 border-[#006D77] border-t-transparent"
            />
            <p className="mt-6 text-gray-600 font-medium">
              Discovering amazing properties...
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {filtered.map((property, index) => {
              const imageUrl = getValidImageUrl(
                (property as any).property_images?.[0]?.image_url,
              );

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <PropertyCard
                    property={{
                      ...property, // all existing fields
                      image: imageUrl, // optional extra field
                      location: `${property.town}, ${property.region}`,
                      isFavorited: property.isFavorited ?? false,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 md:py-32"
          >
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BedDouble className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try
              adjusting your filters or let us help you find what you need.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all inline-flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear All Filters
              </button>
              <Link
                href="/request"
                className="bg-[#006D77] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#005662] transition-all hover:shadow-lg inline-flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Request Custom Property
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
