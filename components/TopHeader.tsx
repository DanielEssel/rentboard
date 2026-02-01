"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-gradient-to-r from-[#006D77] to-[#005662] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-10 flex items-center justify-between text-[11px] sm:text-sm whitespace-nowrap">

          {/* Left: Contact */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <a
              href="tel:+233245258015"
              className="flex items-center gap-1.5 hover:text-[#FFD166] transition"
              aria-label="Call TownWrent"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-medium">
                +233 245 258 015
              </span>
            </a>

            <span className="text-white/30">|</span>

            <a
              href="mailto:info@townwrent.com"
              className="flex items-center gap-1.5 hover:text-[#FFD166] transition"
              aria-label="Email TownWrent"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-medium">
                info@townwrent.com
              </span>
            </a>

            {/* Desktop hint */}
            <div className="hidden lg:flex items-center gap-1.5 text-gray-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>Ghana</span>
            </div>
          </div>

          {/* Right: Links */}
          <nav className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
            <Link
              href="/about"
              className="hover:text-[#FFD166] transition font-medium"
            >
              <span className="sm:hidden">Info</span>
              <span className="hidden sm:inline">About Us</span>
            </Link>

            <span className="text-white/30">|</span>

            <Link
              href="/how-it-works"
              className="hover:text-[#FFD166] transition font-medium"
            >
              <span className="sm:hidden">How</span>
              <span className="hidden sm:inline">How It Works</span>
            </Link>

            <span className="text-white/30">|</span>

            <Link
              href="/contact"
              className="hover:text-[#FFD166] transition font-medium"
            >
              <span className="sm:hidden">Contact</span>
              <span className="hidden sm:inline">Contact</span>
            </Link>

            <span className="text-white/30">|</span>

            <Link
              href="/faqs"
              className="hover:text-[#FFD166] transition font-medium"
            >
              <span className="sm:hidden">FAQs</span>
              <span className="hidden sm:inline">FAQs</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
