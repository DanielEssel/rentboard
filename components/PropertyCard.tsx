import Image from "next/image"
import Link from "next/link"

type Property = {
  id: string
  title: string
  price: number
  location: string
  image: string
}

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
      <Image
        src={property.image}
        alt={property.title}
        width={400}
        height={250}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{property.location}</p>
        <p className="font-bold text-[#006D77] mb-3">GHS {property.price}/month</p>
        <Link href="/explore" className="text-[#FFD166] font-semibold hover:underline">
          View Details
        </Link>
      </div>
    </div>
  )
}
