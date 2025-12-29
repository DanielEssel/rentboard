"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

interface PropertyFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function PropertyFilters({
  search,
  setSearch,
  propertyType,
  setPropertyType,
  priceRange,
  setPriceRange,
  onApplyFilters,
  onClearFilters,
  activeFilterCount,
}: PropertyFiltersProps) {
  return (
    <div className="bg-white border-r border-gray-200 h-full">
      <div className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Filters
              </h3>
              <p className="text-sm text-gray-500">
                Refine your search
              </p>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClearFilters}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
              text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100
              border border-red-200 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Clear {activeFilterCount}
            </motion.button>
          )}
        </div>

        {/* FIELDS */}
        <div className="flex flex-col gap-5 mt-6">

          {/* LOCATION */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Location</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Accra, Central Region..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
              focus:ring-2 focus:ring-[#006D77]/60 focus:border-[#006D77] 
              transition-all text-gray-800 placeholder-gray-400"
            />
          </label>

          {/* PROPERTY TYPE */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Property Type</span>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
              focus:ring-2 focus:ring-[#006D77]/60 focus:border-[#006D77] 
              transition-all cursor-pointer text-gray-800"
            >
              <option value="all">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Single Room">Single Room</option>
              <option value="Self Contained">Self Contained</option>
              <option value="Store">Store</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* PRICE */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Price Range</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
              focus:ring-2 focus:ring-[#006D77]/60 focus:border-[#006D77] 
              transition-all cursor-pointer text-gray-800"
            >
              <option value="all">All Prices</option>
              <option value="low">Under ₵500</option>
              <option value="medium">₵500 - ₵1,000</option>
              <option value="high">Over ₵1,000</option>
            </select>
          </label>

          {/* APPLY BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onApplyFilters}
            className="w-full py-3.5 rounded-xl 
            bg-[#006D77] hover:bg-[#005662] 
            text-white font-semibold shadow-md transition-all"
          >
            Apply Filters
          </motion.button>
        </div>

        {/* ACTIVE FILTER TAGS */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-6"
          >
            {search && (
              <FilterTag label={`Location: ${search}`} onClear={() => setSearch("")} />
            )}

            {propertyType !== "all" && (
              <FilterTag
                label={`Type: ${propertyType}`}
                onClear={() => setPropertyType("all")}
              />
            )}

            {priceRange !== "all" && (
              <FilterTag
                label={`Price: ${priceRange}`}
                onClear={() => setPriceRange("all")}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* FILTER TAG COMPONENT */
function FilterTag({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span
      className="flex items-center gap-1.5 bg-gray-100 
        py-1.5 pl-3 pr-2 rounded-full text-xs font-medium 
        text-gray-700 border border-gray-200"
    >
      {label}
      <button
        onClick={onClear}
        className="p-0.5 rounded-full hover:bg-gray-200 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
