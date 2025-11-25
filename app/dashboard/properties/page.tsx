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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(image_url)")
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
          className="bg-[#006D77] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#04575e]"
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
          You haven’t added any properties yet.
          <div className="mt-4">
            <Link
              href="/post-property"
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
            const coverImage =
              p.property_images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="h-40 relative bg-gray-200">
                  <Image
                    src={coverImage}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {p.town}, {p.region}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-[#006D77]">
                      GHS {p.price.toLocaleString()}/
                      {p.payment_frequency === "monthly" ? "mo" : "yr"}
                    </span>

                    <Link
                      href={`/dashboard/edit/${p.id}`}
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
