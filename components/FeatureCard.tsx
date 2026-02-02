import { LucideIcon } from "lucide-react"

interface Props {
  Icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ Icon, title, description }: Props) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#006D77] to-[#00A896]">
        <Icon className="h-8 w-8 text-[#FFD166]" />
      </div>
      <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  )
}
