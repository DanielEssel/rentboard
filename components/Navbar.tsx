"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, AlertCircle, UserPlus, LogIn } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "List Property", href: "/list-property" },
    { label: "Contact", href: "/contact" },
  ];

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch user on load + listen to auth changes
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();

    // listen to sign in / sign out events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProtectedNav = async (href: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setOpen(false);
    router.push(href);
  };

  const handleSignIn = () => {
    router.push("/auth/login?returnTo=/list-property");
  };

  const handleSignUp = () => {
    router.push("/auth/signup?returnTo=/list-property");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!isMounted) {
    return null; // Prevent SSR mismatch
  }

  return (
    <>
      <nav
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 
        w-[90%] max-w-5xl px-4 py-2 bg-white rounded-2xl flex items-center justify-between
        transition-all duration-300
        ${scrolled ? "shadow-xl" : "shadow-md"}`}
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logos/wrent1.png"
            alt="Wrent Logo"
            width={65}
            height={65}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              if (item.href === "/list-property") {
                return (
                  <button
                    key={item.href}
                    onClick={() => handleProtectedNav(item.href)}
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? "text-[#006D77]" : "text-gray-600 hover:text-[#006D77]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-300 ${
                    isActive ? "text-[#006D77]" : "text-gray-600 hover:text-[#006D77]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* IF NOT LOGGED IN */}
          {!user && (
            <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200">
              <Link
                href="/auth/login"
                className="px-5 py-2 bg-white text-[#006D77] font-semibold hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 bg-[#FFD166] text-[#006D77] font-semibold hover:bg-[#ffc940] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* IF LOGGED IN → User Menu */}
          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-[#006D77] font-semibold hover:bg-teal-50 transition">
                <User size={18} />
                {user.email?.split("@")[0]}
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-[#006D77]">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 
                       w-[90%] bg-white shadow-xl rounded-2xl p-6 z-40"
          >
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.href === "/list-property") {
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleProtectedNav(item.href)}
                      className={`text-lg font-medium text-left ${
                        isActive ? "text-[#006D77]" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium ${
                      isActive ? "text-[#006D77]" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* AUTH SECTION */}
              {!user ? (
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block p-3 rounded-lg border font-semibold text-[#006D77] text-center"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="block p-3 rounded-lg bg-[#FFD166] font-semibold text-[#006D77] text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block p-3 rounded-lg bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-100 text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal - Professional Design */}
      <AnimatePresence>
        {showAuthPrompt && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthPrompt(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] w-[calc(100%-2rem)] sm:w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#006D77] to-[#005662] px-4 sm:px-6 py-4 sm:py-5 relative">
                  <div className="flex items-center gap-2 sm:gap-3 text-white">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-base sm:text-lg">Authentication Required</h3>
                      <p className="text-teal-100 text-xs sm:text-sm hidden sm:block">Please sign in to continue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    To list a property on TownWrent, you need to create an account or sign in.
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <button
                      onClick={handleSignIn}
                      className="w-full bg-[#006D77] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-[#005662] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group text-sm sm:text-base"
                    >
                      <LogIn className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                      Sign In
                    </button>
                    
                    <button
                      onClick={handleSignUp}
                      className="w-full bg-white text-[#006D77] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold border-2 border-[#006D77] hover:bg-[#006D77] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
                    >
                      <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                      Create Account
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors text-xs sm:text-sm py-2"
                  >
                    Continue Browsing
                  </button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="text-[#006D77] hover:underline font-medium">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#006D77] hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}