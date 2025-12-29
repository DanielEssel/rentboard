"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MapPin, Home, DollarSign, BedDouble, Calendar, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function RequestAccommodationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredLocation: "",
    propertyType: "",
    budgetMin: "",
    budgetMax: "",
    bedrooms: "",
    moveInDate: "",
    additionalRequirements: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.preferredLocation.trim()) newErrors.preferredLocation = "Location is required"
    if (!formData.propertyType) newErrors.propertyType = "Property type is required"
    if (!formData.budgetMin) newErrors.budgetMin = "Minimum budget is required"
    if (!formData.moveInDate) newErrors.moveInDate = "Move-in date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      preferredLocation: "",
      propertyType: "",
      budgetMin: "",
      budgetMax: "",
      bedrooms: "",
      moveInDate: "",
      additionalRequirements: ""
    })

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004d56] text-white py-12 md:py-16 px-4 sm:px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-teal-200 text-sm mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-white font-medium">Request Accommodation</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-[#FFD166] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Home className="w-8 h-8 text-[#006D77]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
              Can't Find What You're Looking For?
            </h1>
            <p className="text-teal-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Tell us what you need, and we'll help you find the perfect accommodation that matches your requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Request Submitted Successfully!</p>
                <p className="text-sm text-green-100">We'll contact you within 24 hours.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <main className="px-4 sm:px-6 py-8 md:py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#006D77] to-[#005662] px-6 md:px-8 py-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Accommodation Request Form
            </h2>
            <p className="text-teal-100 text-sm md:text-base">
              Fill in the details below and our team will find matching properties for you
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#006D77]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.fullName 
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                        : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.email 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                          : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.phone 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                          : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                      }`}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Preferences */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#006D77]" />
                Property Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preferred Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.preferredLocation 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                          : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                      }`}
                      placeholder="e.g., Accra, Kumasi, East Legon"
                    />
                  </div>
                  {errors.preferredLocation && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.preferredLocation}
                    </p>
                  )}
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                      errors.propertyType 
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                        : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Self Contained">Self Contained</option>
                    <option value="Store">Store</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.propertyType}
                    </p>
                  )}
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <div className="relative">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20 transition-all appearance-none"
                    >
                      <option value="">Any</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4+">4+ Bedrooms</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (₵) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="budgetMin"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.budgetMin 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                          : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                      }`}
                      placeholder="500"
                    />
                  </div>
                  {errors.budgetMin && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.budgetMin}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (₵)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="budgetMax"
                      value={formData.budgetMax}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20 transition-all"
                      placeholder="2000"
                    />
                  </div>
                </div>

                {/* Move-in Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Move-in Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="moveInDate"
                      value={formData.moveInDate}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.moveInDate 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                          : "border-gray-200 focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20"
                      }`}
                    />
                  </div>
                  {errors.moveInDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.moveInDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#006D77]" />
                Additional Requirements
              </h3>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#006D77] focus:ring-2 focus:ring-[#006D77]/20 transition-all resize-none"
                placeholder="Tell us about any specific requirements, amenities, or preferences you have..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#006D77] to-[#005662] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
              <Link
                href="/explore"
                className="flex-1 sm:flex-initial bg-gray-100 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all text-center"
              >
                Back to Explore
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="bg-[#FFD166] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-[#006D77]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600">We'll contact you within 24 hours with matching properties</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="bg-[#FFD166] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-[#006D77]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Verified Properties</h3>
            <p className="text-sm text-gray-600">All recommended properties are verified and authentic</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="bg-[#FFD166] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-[#006D77]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Help</h3>
            <p className="text-sm text-gray-600">Our team will help you find exactly what you need</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}