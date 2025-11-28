"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface Property {
  id: string;
  title: string;
  price: number;
  payment_frequency: string;
  region: string;
  town: string;
  views: number | null;
  favorites: number | null;
  property_images?: { image_url: string }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

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
    .eq("user_id", user.id) // ← THIS IS THE FIX
    .order("created_at", { ascending: false });

  if (!error && data) {
    setProperties(data as Property[]);
  }

  setLoading(false);
};


  // --- Stats ---
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalFavorites = properties.reduce((sum, p) => sum + (p.favorites || 0), 0);

  const recentProperties = properties.slice(0, 3);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#023047]">Property Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your property performance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
          <p className="text-2xl font-bold text-[#006D77]">{properties.length}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-[#006D77]">{totalViews.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Favorites</h3>
          <p className="text-2xl font-bold text-[#006D77]">{totalFavorites.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">Messages</h3>
          <p className="text-2xl font-bold text-[#006D77]">19</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">Loading your properties...</div>
      )}

      {/* Recent Properties */}
      {!loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#023047]">Your Recent Properties</h2>
            <Link
              href="/dashboard/properties"
              className="text-[#006D77] font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <p className="text-gray-500">No properties added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentProperties.map((p) => {
                const coverImage =
                  p.property_images?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl shadow overflow-hidden"
                  >
                    <div className="h-40 relative">
                      <Image
                        src={coverImage}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="text-sm text-gray-500">
                        {p.town}, {p.region}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[#006D77] font-bold">
                          GHS {p.price.toLocaleString()}/{p.payment_frequency === "monthly" ? "mo" : "yr"}
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
      )}

      {/* Messages Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#023047]">Recent Messages</h2>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">You have 19 new messages.</p>
          <Link href="/dashboard/messages" className="text-[#006D77] font-medium hover:underline">
            Open Inbox →
          </Link>
        </div>
      </div>

    </div>
  );
}
