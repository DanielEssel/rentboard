"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, AlertCircle, UserPlus, LogIn, ChevronDown, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Browse Properties", href: "/explore" },
    { label: "Request a Room", href: "/request" },
    { label: "Post a Property", href: "/list-property" },
  ];

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (open) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('nav') && !target.closest('.mobile-menu')) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleProtectedNav = async (href: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setOpen(false);
    router.push(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSignIn = () => router.push("/auth/login?returnTo=/list-property");
  const handleSignUp = () => router.push("/auth/signup?returnTo=/list-property");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!isMounted) return null;

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-[44px] sm:top-[46px] left-1/2 -translate-x-1/2 z-50 
        w-[96%] sm:w-[95%] max-w-7xl px-3 sm:px-6
        bg-white/50 backdrop-blur-md rounded-full sm:rounded-2xl
        transition-all duration-300 border border-gray-100
        ${scrolled ? "shadow-2xl bg-white" : "shadow-lg"}`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src="/logos/wrent1.png"
              alt="Wrent Logo"
              width={50}
              height={50}
              className="object-contain sm:w-[60px] sm:h-[60px]"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#006D77] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, locations..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-gray-200 
                         focus:border-[#006D77] focus:outline-none focus:ring-2 
                         focus:ring-[#006D77]/20 transition-all bg-white/80 
                         placeholder:text-gray-400 text-sm sm:text-base font-medium"
              />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              if (item.href === "/list-property") {
                return (
                  <button
                    key={item.href}
                    onClick={() => handleProtectedNav(item.href)}
                    className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap ${
                      isActive 
                        ? "bg-[#006D77] text-white shadow-md" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#006D77]"
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
                  className={`px-3 lg:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                    isActive 
                      ? "bg-[#006D77] text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#006D77]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center shrink-0">
            {!user ? (
              <div className="flex rounded-full overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <Link
                  href="/auth/login"
                  className="px-4 lg:px-5 py-2.5 bg-white text-[#006D77] font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 lg:px-5 py-2.5 bg-gradient-to-r from-[#FFD166] to-[#ffc940] text-[#006D77] font-semibold hover:from-[#ffc940] hover:to-[#FFD166] transition-all text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className="outline-none focus-visible:ring-2 focus-visible:ring-[#006D77] focus-visible:ring-offset-2 rounded-full"
                  asChild
                >
                  <button className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full border-2 border-gray-200 text-[#006D77] font-semibold hover:bg-teal-50 hover:border-[#006D77] transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <Avatar className="h-7 w-7 ring-2 ring-white">
                      <AvatarImage src="/user.png" alt="User" />
                      <AvatarFallback className="bg-[#006D77] text-white text-sm sm:text-base">
                        {user.email?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate text-sm sm:text-base hidden lg:inline">
                      {user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-56 rounded-2xl shadow-2xl bg-white border-gray-200 p-2"
                >
                  <div className="px-3 py-2.5 mb-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your account</p>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild>
                    <Link 
                      href="/dashboard" 
                      className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer rounded-lg px-3 py-2.5 text-sm sm:text-base font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#006D77] p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 top-[110px]"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mobile-menu md:hidden fixed top-[112px] left-1/2 -translate-x-1/2 
                       w-[96%] sm:w-[92%] max-w-md bg-white shadow-2xl rounded-3xl 
                       p-5 z-50 border border-gray-100"
            >
              <div className="flex flex-col gap-3">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-2">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#006D77] transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search properties..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 
                               focus:border-[#006D77] focus:outline-none focus:ring-2 
                               focus:ring-[#006D77]/20 transition-all bg-white 
                               placeholder:text-gray-400 text-sm sm:text-base font-medium"
                    />
                  </div>
                </form>

                {menuItems.map((item) => {
                  const isActive = pathname === item.href;

                  if (item.href === "/list-property") {
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleProtectedNav(item.href)}
                        className={`text-left px-4 py-3 rounded-xl font-medium transition-all ${
                          isActive 
                            ? "bg-[#006D77] text-white shadow-md" 
                            : "text-gray-800 hover:bg-gray-100"
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
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive 
                          ? "bg-[#006D77] text-white shadow-md" 
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile Auth */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {!user ? (
                    <div className="flex flex-col gap-2.5">
                      <Link
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-[#006D77] font-semibold text-[#006D77] hover:bg-[#006D77] hover:text-white transition-all"
                      >
                        <LogIn size={18} />
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#FFD166] to-[#ffc940] font-semibold text-[#006D77] hover:shadow-lg transition-all"
                      >
                        <UserPlus size={18} />
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Avatar className="h-10 w-10 ring-2 ring-white">
                          <AvatarImage src="/user.png" alt="User" />
                          <AvatarFallback className="bg-[#006D77] text-white">
                            {user.email?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all font-medium"
                      >
                        <User size={18} />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthPrompt(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         z-[999] w-[94%] max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-br from-[#006D77] via-[#005662] to-[#004a54] px-6 py-6 relative">
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">Authentication Required</h3>
                      <p className="text-teal-100 text-sm sm:text-base">Please sign in to continue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    To post a property on TownWrent, you need to create an account or sign in. Join our community of landlords and tenants today!
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleSignIn}
                      className="w-full bg-gradient-to-r from-[#006D77] to-[#005662] text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </button>

                    <button
                      onClick={handleSignUp}
                      className="w-full bg-white text-[#006D77] px-6 py-3.5 rounded-xl font-semibold border-2 border-[#006D77] hover:bg-[#006D77] hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-white text-gray-500 font-medium uppercase tracking-wider">Or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="w-full text-gray-600 hover:text-gray-900 font-medium py-2.5 text-sm sm:text-base hover:bg-gray-50 rounded-lg transition-all"
                  >
                    Continue Browsing
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-[#006D77] font-semibold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#006D77] font-semibold hover:underline">
                      Privacy Policy
                    </Link>
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