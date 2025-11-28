"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/explore');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Back Button */}
        <Link 
          href="/explore" 
          className="flex items-center gap-2 text-[#006D77] hover:text-[#005662] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </Link>

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#006D77]">
          <Image
            src="/logos/wrent1.png"
            alt="Wrent Logo"
            width={55}
            height={55}
            className="object-contain"
          />
        </Link>

        {/* RIGHT SIDE: Account Controls */}
        <div className="flex items-center gap-4">
          {/* NOT LOGGED IN */}
          {!user && (
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="text-[#006D77] font-semibold hover:text-[#005662]"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="px-3 py-1.5 bg-[#FFD166] text-[#006D77] rounded-lg font-semibold hover:bg-[#ffc940] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* LOGGED IN */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border">
                <User size={16} className="text-[#006D77]" />
                <span className="text-sm font-medium text-[#006D77]">
                  {user.email?.split("@")[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-red-600 text-sm font-medium hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
