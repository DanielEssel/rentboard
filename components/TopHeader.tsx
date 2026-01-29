"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-gradient-to-r from-[#006D77] to-[#005662] text-white py-2.5 px-4 sm:px-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          {/* Left Side - Contact Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5">
            <a 
              href="tel:+233245258015" 
              className="flex items-center gap-1.5 hover:text-[#FFD166] transition-colors group"
            >
              <Phone className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">+233 245 258 015</span>
            </a>
            
            <a 
              href="mailto:info@townwrent.com" 
              className="flex items-center gap-1.5 hover:text-[#FFD166] transition-colors group"
            >
              <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">info@townwrent.com</span>
              <span className="font-medium sm:hidden">Email Us</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-gray-200">
              <MapPin className="h-3.5 w-3.5" />
              <span>Serving All of Ghana</span>
            </div>
          </div>

          {/* Right Side - Quick Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/about" 
              className="hover:text-[#FFD166] transition-colors font-medium"
            >
              About Us
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              href="/how-it-works" 
              className="hover:text-[#FFD166] transition-colors font-medium"
            >
              How It Works
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              href="/contact" 
              className="hover:text-[#FFD166] transition-colors font-medium"
            >
              Contact
            </Link>
            <span className="text-white/30 hidden sm:inline">|</span>
            <Link 
              href="/faqs" 
              className="hover:text-[#FFD166] transition-colors font-medium hidden sm:inline"
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}