"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, AlertCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Explore", href: "/explore" },
    { label: "List Property", href: "/list-property" },
    { label: "Contact", href: "/contact" },
  ];

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
    router.push(href);
  };

  const handleSignIn = () => {
    router.push("/auth/login?returnTo=/list-property");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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

      {/* --- MOBILE MENU --- */}
{open && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
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

      {/* ---- AUTH SECTION ---- */}
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


      {/* ---- AUTH MODAL ---- */}
      {showAuthPrompt && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] bg-white text-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#FFD166]/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#006D77]" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg text-[#006D77] mb-2">
                  Sign In Required
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You need to be signed in to continue.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSignIn}
                    className="flex-1 bg-[#006D77] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005662] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAuthPrompt(false)}
            className="fixed inset-0 bg-black/50 z-[998]"
          />
        </>
      )}
    </>
  );
}
