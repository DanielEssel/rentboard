"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Property {
  id: string;
  title: string;
  price: number;
  payment_frequency: string;
  region: string;
  town: string;
  property_images?: { image_url: string }[];
}

export default function PropertiesPage() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  // Helper function to convert Supabase storage paths to public URLs
  const getPublicImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
    }

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Convert Supabase storage path to public URL
    try {
      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(imagePath);
      
      return data?.publicUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
    } catch (error) {
      console.error("Error getting public URL:", error);
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProperties([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(image_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProperties(data as Property[]);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#023047]">My Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage, update, and monitor all your property listings.
          </p>
        </div>

        <Link
          href="/dashboard/add"
          className="bg-[#006D77] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#04575e] transition-colors"
        >
          <Plus size={18} /> Add Property
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading your properties...
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          You haven't added any properties yet.
          <div className="mt-4">
            <Link
              href="/dashboard/add"
              className="text-[#006D77] font-medium hover:underline"
            >
              Post your first property →
            </Link>
          </div>
        </div>
      )}

      {/* Property List */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((p) => {
            // Get the cover image with proper URL conversion
            const coverImage = getPublicImageUrl(p.property_images?.[0]?.image_url);

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 relative bg-gray-200">
                  <Image
                    src={coverImage}
                    alt={p.title}
                    fill
                    className="object-cover"
                    unoptimized={coverImage.includes('supabase')}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{p.title}</h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {p.town}, {p.region}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-[#006D77]">
                      ₵{p.price.toLocaleString()}/
                      {p.payment_frequency === "monthly" ? "mo" : "yr"}
                    </span>

                    <Link
                      href={`/dashboard/properties/${p.id}`}
                      className="text-[#FFD166] font-semibold hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}