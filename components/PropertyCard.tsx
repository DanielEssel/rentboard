import Image from "next/image"
import Link from "next/link"

type Property = {
  listedBy: any;
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  price: number;
  payment_frequency: "monthly" | "yearly" | "negotiable";
  available: boolean;
  region: string;
  location: string;
  image: string;
  town: string;
  landmark: string | null;
  amenities: string[];
  description: string;
  created_at: string;
  updated_at: string;
  views?: number
  favorites?: number
  isFavorited?: boolean
}

interface Props {
  property: Property
}

// Custom Heart Icon Component (no lucide-react dependency)
const HeartIcon = ({ filled = false, className = "" }: { filled?: boolean; className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function PropertyCard({ property }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative bg-white">
      
      {/* Property Image */}
      <div className="relative w-full h-52">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white/90 transition-colors">
        <HeartIcon
          filled={property.isFavorited}
          className={
            property.isFavorited
              ? "fill-red-500 text-red-500 cursor-pointer"
              : "text-gray-600 cursor-pointer hover:text-red-400"
          }
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
        <p className="text-sm sm:text-base text-gray-500 mb-2 line-clamp-1">{property.location}</p>
        <p className="font-bold text-[#006D77] mb-3 text-lg">
          GHS {property.price.toLocaleString()}/month
        </p>

        {/* Stats: Views + Favorites */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            👁 {property.views || 0}
          </span>

          <span className="flex items-center gap-1">
            ❤️ {property.favorites || 0}
          </span>
        </div>

        <Link
          href={`/property/${property.id}`}
          className="text-[#FFD166] font-semibold hover:underline inline-block"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}