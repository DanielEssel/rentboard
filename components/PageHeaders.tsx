"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[#006D77] hover:text-[#005662] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </Link>
        <Link href="/" className="text-xl font-bold text-[#006D77]">
          Kojo Essel Realty
        </Link>
      </div>
    </nav>
  );
}