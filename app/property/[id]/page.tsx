"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  AlertCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { Button } from "@/components/ui/button";

/* ---------- Types ---------- */
type Property = {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  paymentFrequency: string;
  available: boolean;
  region: string;
  town: string;
  landmark: string;
  amenities: string[];
  description: string;
  images: string[];
  listedBy: {
    name: string;
    phone: string;
    email?: string;
  };
  verified: boolean;
  createdAt: string;
  bedrooms?: number;
};

/* ---------- Mock Data (Replace with API/Supabase call) ---------- */
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "2-Bedroom Apartment at Awutu Bawjiase",
    propertyType: "Apartment",
    price: 800,
    paymentFrequency: "monthly",
    available: true,
    region: "Central Region",
    town: "Awutu Bawjiase",
    landmark: "Near Morning Star Temple",
    amenities: ["Water", "Electricity", "Parking", "Toilet Inside", "Security"],
    description:
      "Beautiful 2-bedroom apartment in a serene neighborhood. Close to schools, markets, and public transport. Water runs regularly and the area is very secure with a community watchman. Landlord is flexible with payment terms.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    listedBy: {
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      email: "kwame@example.com",
    },
    verified: true,
    createdAt: "2024-11-01",
    bedrooms: 2,
  },
  {
    id: "2",
    title: "Single Room Self Contained at Kasoa",
    propertyType: "Single Room",
    price: 450,
    paymentFrequency: "monthly",
    available: true,
    region: "Greater Accra",
    town: "Kasoa",
    landmark: "Behind Kasoa Market",
    amenities: ["Water", "Electricity", "Toilet Inside"],
    description:
      "Affordable single room with private bathroom and kitchen. Perfect for a single person or couple. Located in a quiet area with easy access to transport.",
    images: [
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    listedBy: {
      name: "Ama Serwaa",
      phone: "+233 54 987 6543",
    },
    verified: true,
    createdAt: "2024-10-28",
    bedrooms: 1,
  },
];

/* ---------- Component ---------- */
export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Simulate API call - Replace with actual Supabase query
    const fetchProperty = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const found = MOCK_PROPERTIES.find((p) => p.id === propertyId);
      setProperty(found || null);
      setLoading(false);
    };

    fetchProperty();
  }, [propertyId]);

  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContact = (method: "phone" | "whatsapp") => {
    if (!property) return;

    if (method === "phone") {
      window.location.href = `tel:${property.listedBy.phone}`;
    } else {
      const message = encodeURIComponent(
        `Hi, I'm interested in your property: ${property.title}`
      );
      window.open(
        `https://wa.me/${property.listedBy.phone.replace(
          /\s/g,
          ""
        )}?text=${message}`,
        "_blank"
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006D77] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/explore")}
            className="bg-[#006D77] text-white px-6 py-3 rounded-xl hover:bg-[#005662] transition-colors"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <BackButton variant="ghost" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}

            {/* Verified Badge */}
            {property.verified && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" />
                Verified
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-900">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? "border-[#FFD166] scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {property.town}, {property.region}
                    </span>
                  </div>
                  {property.landmark && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {property.landmark}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#006D77]">
                    ₵{property.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    / {property.paymentFrequency}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <span className="px-3 py-1 bg-teal-50 text-[#006D77] rounded-full text-sm font-medium">
                  {property.propertyType}
                </span>
                {property.bedrooms && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {property.bedrooms} Bedroom
                    {property.bedrooms > 1 ? "s" : ""}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.available
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {property.available ? "Available" : "Occupied"}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </motion.div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-[#006D77] rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Property Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Property ID:</span>
                  <p className="font-medium text-gray-800">#{property.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Listed On:</span>
                  <p className="font-medium text-gray-800">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Region:</span>
                  <p className="font-medium text-gray-800">{property.region}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p
                    className={`font-medium ${
                      property.verified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {property.verified ? "Verified" : "Pending Verification"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Landlord
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">Listed by</span>
                  <p className="font-medium text-gray-800">
                    {property.listedBy.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{property.listedBy.phone}</span>
                </div>

                {property.listedBy.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{property.listedBy.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleContact("whatsapp")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={() => handleContact("phone")}
                  className="w-full bg-[#006D77] hover:bg-[#005662] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                 <Button
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-[#FFD166] hover:bg-[#f0c356] text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Site Visit (₵15)
              </Button>
              </div>
             

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-500">
                  By contacting, you agree to our Terms of Service
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <BookSiteVisitModal
        propertyTitle={property.title}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
      />

      <Footer />
    </div>
  );
}
