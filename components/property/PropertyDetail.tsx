"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, BadgeCheck, ChevronLeft, ChevronRight, AlertCircle
} from "lucide-react";
import PageHeaders from "@/components/PageHeaders"; 
import Footer from "@/components/Footer"; 
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */
type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
};

type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string | null;
  email?: string | null;
};

type Property = {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  price: number;
  payment_frequency: string;
  available: boolean;
  region: string;
  town: string;
  landmark?: string | null;
  amenities: string[];
  description: string;
  created_at: string;
  updated_at: string;
  rooms?: number | null;
  verified?: boolean | null;
  images?: string[];
  listedBy?: Profile | null;
};

export default function PropertyDetail({ propertyId, mode = "public" }: { propertyId: string; mode?: "public" | "dashboard" }) {
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Helpers ---------- */
  const toPublicUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
  };

  /* ---------- Fetch Property ---------- */
  useEffect(() => {
    if (!propertyId) return;
    fetchProperty(propertyId);
  }, [propertyId]);

  const fetchProperty = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: prop, error: propError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (propError) throw propError;

      const { data: imgs } = await supabase
        .from("property_images")
        .select("*")
        .eq("property_id", id)
        .order("display_order");

      const imageUrls = (imgs || []).map((img) => toPublicUrl(img.image_url));

      const { data: owner } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", prop.user_id)
        .single();

      setProperty({
        ...prop,
        images: imageUrls,
        listedBy: owner || null,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Image Controls ---------- */
  const nextImage = () =>
    property?.images &&
    setCurrentImageIndex((i) => (i + 1) % property.images!.length);

  const prevImage = () =>
    property?.images &&
    setCurrentImageIndex((i) =>
      i === 0 ? property.images!.length - 1 : i - 1
    );

  /* ---------- Render States ---------- */
  if (loading)
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!property)
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Property not found</p>
      </div>
    );

  /* ---------- Public vs Dashboard Mode ---------- */
  const showHeader = mode === "public";
  const showFooter = mode === "public";
  const showContactCard = mode === "public";

  return (
    <div className="bg-gray-50 min-h-screen">
      {showHeader && (
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-sm">
          <PageHeaders />
        </div>
      )}

      {/* ---------- Image Gallery ---------- */}
      <div className="relative bg-black max-w-7xl mx-auto">
        <div className="relative h-96">
          {/* eslint-disable-next-line */}
          <img
            src={property.images?.[currentImageIndex] || ""}
            className="w-full h-full object-cover"
            alt="Property"
          />

          {property.images && property.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronLeft />
              </button>

              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronRight />
              </button>

              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 p-6">

        {/* LEFT SIDE — MAIN INFO */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title / Price */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-bold">{property.title}</h1>

            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              {property.town}, {property.region}
            </div>

            <p className="text-3xl text-teal-700 font-bold mt-4">₵{property.price.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">/ {property.payment_frequency}</p>

            {mode === "dashboard" && (
              <Button
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}
              >
                Edit Property
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((a) => (
                  <p key={a} className="text-gray-700">• {a}</p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT — CONTACT CARD (Public only) */}
        {showContactCard && (
          <div className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>

            <p className="font-medium">{property.listedBy?.full_name}</p>

            <div className="mt-4 space-y-2 text-gray-700">
              <div className="flex items-center gap-2"><Phone className="w-4" /> {property.listedBy?.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-4" /> {property.listedBy?.email}</div>
            </div>

            <Button
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Site Visit (₵15)
            </Button>
          </div>
        )}

      </div>

      <BookSiteVisitModal
        propertyTitle={property.title}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
      />

      {showFooter && <Footer />}
    </div>
  );
}
