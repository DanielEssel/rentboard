"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, BarChart2, MessageSquare, Settings, X } from "lucide-react"
import Image from "next/image"

const menuItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "My Properties", href: "/dashboard/properties", icon: Building2 },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-72 h-full bg-[#006D77] text-white flex flex-col shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Image
          src="/logos/wrent1.png"
          alt="Wrent Logo"
          width={55}
          height={55}
          className="object-contain"
          priority
        />

        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                  ? "bg-[#FFD166] text-[#006D77] font-semibold shadow-lg"
                  : "hover:bg-white/10 hover:translate-x-1"
                }`}
            >
              <Icon
                size={20}
                className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform`}
              />
              <span className="text-sm">{item.label}</span>

              {active && <div className="ml-auto w-2 h-2 bg-[#006D77] rounded-full animate-pulse"></div>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-semibold">Need Help?</p>
          <p className="text-xs text-white/70 mb-3">
            Check our documentation or contact support
          </p>

          <button className="w-full bg-[#FFD166] text-[#006D77] text-sm font-semibold py-2 rounded-lg hover:bg-[#FFC94D] transition">
            Get Support
          </button>
        </div>
      </div>
    </aside>
  )
}
