"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
  className?: string
  variant?: "default" | "ghost" | "outline"
}

export default function BackButton({ 
  href, 
  onClick, 
  label = "Back",
  className = "",
  variant = "default"
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const variantStyles = {
    default: "bg-white text-[#006D77] border border-gray-200 hover:bg-gray-50 shadow-sm",

  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-8 py-2 rounded-lg font-medium transition-all
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  )
}