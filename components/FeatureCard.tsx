import { LucideIcon } from "lucide-react"

interface Props {
  Icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ Icon, title, description }: Props) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-center">
      <Icon className="h-10 w-10 text-[#006D77] mx-auto mb-3" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
