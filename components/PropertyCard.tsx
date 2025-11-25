import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"  // nice minimal icon (Next.js-friendly)

type Property = {
  id: string
  title: string
  price: number
  location: string
  image: string
  views: number
  favorites: number
  isFavorited?: boolean
  
}

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition relative">
      {/* Property Image */}
      <Image
        src={property.image}
        alt={property.title}
        width={400}
        height={250}
        className="w-full h-52 object-cover"
      />

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
        <Heart
          size={20}
          className={
            property.isFavorited
              ? "fill-red-500 text-red-500 cursor-pointer"
              : "text-gray-600 cursor-pointer"
          }
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{property.location}</p>
        <p className="font-bold text-[#006D77] mb-3">
          GHS {property.price}/month
        </p>

        {/* Stats: Views + Favorites */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            👁 {property.views}
          </span>

          <span className="flex items-center gap-1">
            ❤️ {property.favorites}
          </span>
        </div>

        <Link
          href={`/property/${property.id}`}
          className="text-[#FFD166] font-semibold hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
