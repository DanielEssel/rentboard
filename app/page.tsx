"use client"
import HeroSection from "@/components/HeroSection"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import TestimonialCarousel from "@/components/Testimonial"
import StatsSection from "@/components/StatsSection"
import TopHeader from "@/components/TopHeader"
import FeaturedCommunities from "@/components/home/FeaturedCommunities"
import HowItWorks from "@/components/home/HowItWorks"
import RecentProperties from "@/components/home/RecentProperties"
import FeaturedProperties from "@/components/home/FeaturedProperties"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import CTASection from "@/components/home/CTASection"

export default function LandingPage() {
  return (
    <main className="font-sans">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-sm"> 
        <Navbar />
      </div>
    
      {/* Enhanced Hero Section */}
      <div className="relative">
        <HeroSection />
      </div>
      
      {/* Stats Section */}
      <StatsSection />

      {/* Featured Communities Section */}
      <FeaturedCommunities />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Recently Listed Properties */}
      <RecentProperties />

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </main>
  )
}