"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNotifications } from "@/hooks/useNotifications";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

export default function DashboardTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Load User ----------------------------- */
  const fetchUserProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email || "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData || null);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) router.push("/auth/login");
      else fetchUserProfile();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  /* ---------------------- Notifications Hook ------------------------- */
  const { unreadCount, messages, fetchMessages } = useNotifications(userId);

  /* ----------------------------- Helpers ------------------------------ */
  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;

    const name = profile?.full_name || email;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=006D77&color=fff&size=128`;
  };

  const displayName = profile?.full_name || email.split("@")[0] || "User";

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* ----------------------------- UI ------------------------------ */
  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-4 md:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link
          href="/dashboard/add"
          className="bg-[#006D77] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#04575e]"
        >
          <Plus size={18} /> Add Property
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 🔔 Notifications Dropdown */}
        {userId && (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-700" />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
              <p className="px-3 py-2 text-sm sm:text-base font-semibold">Notifications</p>
              <DropdownMenuSeparator />

              {messages.length === 0 ? (
                <p className="text-center py-3 text-gray-500 text-sm sm:text-base">
                  No messages
                </p>
              ) : (
                messages.map((msg) => (
                  <DropdownMenuItem
                    key={msg.id}
                    onClick={async () => {
                      await supabase
                        .from("messages")
                        .update({ is_read: true })
                        .eq("id", msg.id);

                      fetchMessages();
                      router.push(`/dashboard/messages/${msg.id}`);
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm sm:text-base ${
                      msg.is_read ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <p className="font-medium">{msg.message.slice(0, 40)}...</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* USER MENU */}
        {loading ? (
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg">
              <Image
                src={getAvatarUrl()}
                alt="avatar"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full border-2 border-[#006D77]/20"
              />
              <div className="hidden md:block">
                <p className="text-sm sm:text-base font-medium">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{displayName}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/")}>
                <User className="w-4 h-4 mr-2" /> Home
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
