"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Kwame Mensah",
    role: "Tenant",
    location: "Awutu Bawjiase",
    text: "Finding a place was so easy! The agency verified everything and I moved in within a week. Highly recommended!",
    rating: 5,
    image: "/images/avatar1.jpg"
  },
  {
    id: 2,
    name: "Ama Asante",
    role: "Landlord",
    location: "Bawjiase",
    text: "I listed my property and had reliable tenants in no time. The transparent process made everything smooth.",
    rating: 5,
    image: "/images/avatar2.jpg"
  },
  {
    id: 3,
    name: "Yaw Boateng",
    role: "Tenant",
    location: "Central Market Area",
    text: "The site visit booking was seamless. I appreciated the guidance throughout the rental process.",
    rating: 5,
    image: "/images/avatar3.jpg"
  },
  {
    id: 4,
    name: "Akosua Darko",
    role: "Landlord",
    location: "Awutu Bawjiase",
    text: "Professional service from start to finish. My property was matched with great tenants quickly.",
    rating: 5,
    image: "/images/avatar4.jpg"
  }
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-scroll effect
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000) // Change testimonial every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isHovered])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <motion.section 
      className="py-20 px-6 bg-gradient-to-br from-[#006D77] to-[#005259] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-12 text-center"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.15 } }
        }}
      >
        What Our Clients Say
      </motion.h2>

      <div 
        className="max-w-5xl mx-auto relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <Quote className="absolute top-6 left-6 w-16 h-16 text-[#E0FBFC] opacity-20" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar Image */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-[#E0FBFC]/30">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg md:text-xl mb-6 italic leading-relaxed">
                  "{currentTestimonial.text}"
                </p>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-[#E0FBFC]" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <div>
                  <p className="font-bold text-xl">{currentTestimonial.name}</p>
                  <p className="text-[#E0FBFC] text-sm sm:text-base">
                    {currentTestimonial.role} • {currentTestimonial.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
              <motion.div
                className="h-full bg-[#E0FBFC]"
                initial={{ width: "0%" }}
                animate={{ width: isHovered ? "0%" : "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                key={currentIndex}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prev}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3 hover:scale-110 transform duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-[#E0FBFC]' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3 hover:scale-110 transform duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.section>
  )
}