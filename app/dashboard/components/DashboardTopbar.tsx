"use client"

import { useEffect, useState } from "react"
import { Bell, Plus, Menu, ChevronDown, User, Settings, LogOut, Home } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"


interface Profile {
  full_name: string | null
  avatar_url: string | null
}

export default function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/auth/login')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchUserProfile()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const fetchUserProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        router.push('/auth/login')
        return
      }

      setEmail(session.user.email || "")

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", session.user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleListProperty = () => {
    router.push('/dashboard/add')
  }

  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url
    }
    const name = profile?.full_name || email || "User"
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=006D77&color=fff&size=128`
  }

  const getDisplayName = () => {
    return profile?.full_name || email.split('@')[0] || "User"
  }

  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-4 md:px-6">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Post Property Button */}
        <Link
          href="/dashboard/add"
          className="bg-[#006D77] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#04575e]"
        >
          <Plus size={18} /> Add Property
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Notifications Button */}
        <button 
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Dropdown Menu */}
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:ring-offset-2">
              <Image
                src={getAvatarUrl()}
                alt="User Avatar"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#006D77]/20"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push('/dashboard/settings')}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}