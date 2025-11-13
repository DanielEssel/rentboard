import { ReactNode } from "react"
import Link from "next/link"

interface Props {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary"
}

export default function CTAButton({ href, children, variant = "primary" }: Props) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className="px-6 py-3 rounded-md bg-[#FFD166] text-[#006D77] font-semibold hover:opacity-90 transition"
      >
        {children}
      </Link>
    )
  } else {
    return (
      <Link
        href={href}
        className="px-6 py-3 rounded-md border border-white hover:bg-white hover:text-[#006D77] transition"
      >
        {children}
      </Link>
    )
  }
}
