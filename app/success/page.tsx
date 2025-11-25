"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Eye, Heart, Edit3, ArrowLeft } from "lucide-react";

interface Props {
  // You can pass this via query parameters or use router state
  property?: {
    id: string;
    title: string;
    image: string;
    price: number;
    location: string;
    views: number;
    favorites: number;
  };
}

export default function PropertySuccessPage({ property }: Props) {
  const data = property ?? {
    // fallback mock data for development
    id: "123",
    title: "Modern 2-Bedroom Apartment",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    price: 950,
    location: "Accra, Ghana",
    views: 0,
    favorites: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 py-16">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-[#06D6A0] mb-6"
      >
        <CheckCircle size={90} strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-gray-800 text-center mb-3"
      >
        Property Posted Successfully!
      </motion.h1>

      <p className="text-gray-600 text-center max-w-lg mb-10">
        Your property is now live on the platform. You can track performance, edit details, or improve visibility anytime.
      </p>

      {/* Property Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg overflow-hidden mb-10"
      >
        <Image
          src={data.image}
          width={600}
          height={400}
          alt="Property"
          className="w-full h-60 object-cover"
        />

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {data.title}
          </h2>
          <p className="text-gray-500 mb-3">{data.location}</p>

          <p className="text-[#006D77] font-bold text-lg mb-4">
            GHS {data.price}/month
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-gray-700 mb-2">
            <div className="flex items-center gap-1">
              <Eye size={18} /> {data.views}
            </div>
            <div className="flex items-center gap-1">
              <Heart size={18} /> {data.favorites}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Listings with high-quality photos receive 3× more inquiries.
          </p>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href={`/property/${data.id}`}>
          <button className="px-6 py-3 rounded-xl bg-[#006D77] text-white font-medium shadow hover:bg-[#00555f] transition">
            View Listing
          </button>
        </Link>

        <Link href={`/dashboard/edit/${data.id}`}>
          <button className="px-6 py-3 rounded-xl bg-white border text-gray-700 font-medium shadow hover:bg-gray-100 transition flex items-center gap-2">
            <Edit3 size={18} /> Edit Listing
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium shadow hover:bg-gray-300 transition flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
