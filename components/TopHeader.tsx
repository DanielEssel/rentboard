"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-gradient-to-r from-[#006D77] to-[#005662] text-white py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm">
          {/* Left Side - Contact Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <a 
              href="tel:+233245258015" 
              className="flex items-center gap-1 hover:text-[#FFD166] transition-colors group"
            >
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">+233 245 258 015</span>
            </a>
            
            <span className="text-white/30 hidden xs:inline">|</span>
            
            <a 
              href="mailto:info@townwrent.com" 
              className="flex items-center gap-1 hover:text-[#FFD166] transition-colors group"
            >
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">info@townwrent.com</span>
              <span className="font-medium sm:hidden">Email</span>
            </a>

            <span className="text-white/30 hidden md:inline">|</span>

            <div className="hidden md:flex items-center gap-1.5 text-gray-200">
              <MapPin className="h-3.5 w-3.5" />
              <span>Ghana</span>
            </div>
          </div>

          {/* Right Side - Quick Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/about" 
              className="hover:text-[#FFD166] transition-colors font-medium"
            >
              About
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              href="/how-it-works" 
              className="hover:text-[#FFD166] transition-colors font-medium whitespace-nowrap"
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