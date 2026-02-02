"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    router.push("/explore");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl 
        border-b transition-all duration-300 
        ${
          scrolled ? "shadow-lg border-gray-200" : "shadow-sm border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* NAVBAR ROW */}
          <div className="relative flex items-center justify-between h-16 sm:h-20">
            {/* MOBILE: HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-[#006D77] transition"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>

            {/* DESKTOP: BACK BUTTON */}
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[#006D77] 
              hover:bg-teal-50 transition font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
              <span>Back</span>
            </Link>

            {/* CENTER LOGO — Perfectly CENTERED */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link
                href="/"
                className="flex items-center justify-center hover:opacity-80 transition"
              >
                <Image
                  src="/logos/wrent1.png"
                  alt="Wrent Logo"
                  width={55}
                  height={55}
                  priority
                  className="object-contain sm:w-[60px] sm:h-[60px]"
                />
              </Link>
            </div>

            {/* DESKTOP RIGHT SIDE */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="px-5 py-2 text-[#006D77] font-semibold hover:bg-gray-100 rounded-xl transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="px-5 py-2 bg-gradient-to-r from-[#FFD166] to-[#ffc940] 
                    text-[#006D77] rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* User Card */}
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full border 
                  bg-gray-50 hover:border-[#006D77] hover:bg-teal-50 transition"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src="/user.png" />
                      <AvatarFallback className="bg-[#006D77] text-white text-xs">
                        {user.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm sm:text-base font-semibold text-[#006D77] max-w-[120px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 
                    hover:bg-red-50 rounded-xl transition font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE: RIGHT PLACEHOLDER FOR CENTERING */}
            <div className="md:hidden w-10" />
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide Panel */}
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="p-6">
                {/* MOBILE HEADER */}
                <div className="flex items-center justify-between mb-8">
                  <Image
                    src="/logos/wrent1.png"
                    alt="Wrent Logo"
                    width={50}
                    height={50}
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* NAV ITEMS */}
                <div className="space-y-4">
                  <Link
                    href="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition font-medium text-gray-800"
                  >
                    <ArrowLeft size={20} className="text-[#006D77]" />
                    Back to Explore
                  </Link>

                  <div className="border-t border-gray-200 my-4" />

                  {/* AUTH SECTION */}
                  {user ? (
                    <>
                      <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-white">
                            <AvatarImage src="/user.png" />
                            <AvatarFallback className="bg-[#006D77] text-white">
                              {user.email?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {user.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                      >
                        <User size={20} className="text-[#006D77]" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition text-red-600 font-medium"
                      >
                        <LogOut size={20} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl border-2 border-[#006D77] 
                        text-[#006D77] font-semibold text-center hover:bg-[#006D77] hover:text-white transition"
                      >
                        Login
                      </Link>

                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFD166] to-[#ffc940] 
                        text-[#006D77] font-semibold text-center hover:shadow-lg transition"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
