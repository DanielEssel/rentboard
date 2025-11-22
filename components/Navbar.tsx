"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "List Property", href: "/list-property" },
    { label: "Contact", href: "/contact" },
  ];

  // Scroll listener for shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
  ref={navRef}
  className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 
  w-[90%] max-w-5xl px-4 py-2 bg-white rounded-2xl flex items-center justify-between
  transition-all duration-300
  ${scrolled ? "shadow-xl" : "shadow-md"}
`}
>
  {/* Logo */}
  <Link href="/" className="inline-flex items-center">
    <Image 
      src="/logos/wrent1.png" 
      alt="Wrent Logo" 
      width={70} 
      height={70} 
      className="object-contain"
    />
  </Link>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-[#006D77]"
                    : "text-gray-600 hover:text-[#006D77]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Login & Sign Up buttons */}
        {pathname !== "/explore" && (
          <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200">
            <Link
              href="/login"
              className="px-5 py-2 bg-white text-[#006D77] font-semibold hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-[#FFD166] text-[#006D77] font-semibold hover:bg-[#ffc940] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Explore page role switch */}
        {pathname === "/explore" && (
          <button
            onClick={() => {
              localStorage.removeItem("userRole");
              router.push("/select-user");
            }}
            className="px-5 py-2 font-semibold rounded-full text-[#006D77] hover:bg-teal-50 transition-colors border border-gray-200"
          >
            Switch Role
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="text-[#006D77]">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[90%] max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center py-6 gap-4 md:hidden"
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-[#006D77]"
                    : "text-gray-600 hover:text-[#006D77]"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200 mt-2">
            <Link
              href="/login"
              className="px-5 py-2 bg-white text-[#006D77] font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-[#FFD166] text-[#006D77] font-semibold hover:bg-[#ffc940] transition-colors"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}