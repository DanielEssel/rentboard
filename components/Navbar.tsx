"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, AlertCircle, UserPlus, LogIn } from "lucide-react";
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
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "Post A Property", href: "/list-property" },
    { label: "Contact", href: "/contact" },
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

  const handleProtectedNav = async (href: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setOpen(false);
    router.push(href);
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
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 
        w-[94%] sm:w-[90%] max-w-5xl px-3 sm:px-4 
        bg-white rounded-2xl flex items-center justify-between
        transition-all duration-300
        ${scrolled ? "shadow-xl" : "shadow-md"}`}
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center shrink-0">
          <Image
            src="/logos/wrent1.png"
            alt="Wrent Logo"
            width={55}
            height={55}
            className="object-contain sm:w-[65px] sm:h-[65px]"
            priority
          />
        </Link>
        {/* Desktop Menu */}
<div className="hidden md:flex items-center gap-8">
  {menuItems.map((item) => {
    const isActive = pathname === item.href;

    if (item.href === "/list-property") {
      return (
        <button
          key={item.href}
          onClick={() => handleProtectedNav(item.href)}
          className={`font-medium transition cursor-pointer ${
            isActive ? "text-[#006D77]" : "text-gray-700 hover:text-[#006D77]"
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
        className={`font-medium transition ${
          isActive ? "text-[#006D77]" : "text-gray-700 hover:text-[#006D77]"
        }`}
      >
        {item.label}
      </Link>
    );
  })}
</div>


        {/* Desktop Auth Section */}
{!user ? (
  <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200">
    <Link
      href="/auth/login"
      className="px-4 py-2 bg-white text-[#006D77] font-semibold hover:bg-gray-50"
    >
      Login
    </Link>
    <Link
      href="/auth/signup"
      className="px-4 py-2 bg-[#FFD166] text-[#006D77] font-semibold hover:bg-[#ffc940]"
    >
      Sign Up
    </Link>
  </div>
) : (
  <div className="relative w-fit">
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger
  className="outline-none data-[state=open]:bg-transparent !w-auto flex items-center gap-2"
  asChild
>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-[#006D77] font-semibold hover:bg-teal-50 cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/user.png" alt="User" />
          <AvatarFallback>
            {user.email?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {user.email?.split("@")[0]}
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-48 rounded-xl shadow-xl bg-white"
    >
      <div className="px-3 py-2 text-sm">
        <p className="font-medium text-gray-900">{user.email}</p>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Link href="/dashboard" className="w-full cursor-pointer">
          Dashboard
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={handleLogout}
        className="text-red-600 cursor-pointer"
      >
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  </div>
)}


        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#006D77] p-2 rounded-lg active:scale-95 transition"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[82px] left-1/2 -translate-x-1/2 
                       w-[94%] sm:w-[90%] max-w-lg bg-white shadow-xl rounded-2xl 
                       p-6 z-40"
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
                        isActive ? "text-[#006D77]" : "text-gray-800"
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
                      isActive ? "text-[#006D77]" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth */}
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
                    className="block p-3 rounded-lg bg-gray-100 text-center"
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

      {/* AUTH MODAL — OPTIMIZED FOR SMALL SCREENS */}
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
              transition={{ duration: 0.4 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         z-[999] w-[94%] max-w-md sm:w-full"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#006D77] to-[#005662] px-5 py-5 relative">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Authentication Required</h3>
                      <p className="text-teal-100 text-sm hidden sm:block">Please sign in to continue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    To Post A Property on TownWrent, you need to create an account or sign in.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleSignIn}
                      className="w-full bg-[#006D77] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005662] flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </button>

                    <button
                      onClick={handleSignUp}
                      className="w-full bg-white text-[#006D77] px-6 py-3 rounded-xl font-semibold border-2 border-[#006D77] hover:bg-[#006D77] hover:text-white flex items-center justify-center gap-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      Create Account
                    </button>
                  </div>

                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="w-full text-gray-600 font-medium py-2 text-sm"
                  >
                    Continue Browsing
                  </button>
                </div>

                <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-[#006D77] font-medium hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#006D77] font-medium hover:underline">
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
