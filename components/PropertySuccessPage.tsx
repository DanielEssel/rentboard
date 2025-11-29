"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Edit3, ArrowLeft, MessageSquare, Phone, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
};

type Property = {
  id: string;
  title: string;
  price: number;
  town: string;
  region: string;
  payment_frequency: string;
  user_id: string;
  images: string[];
  listedBy?: Profile | null;
};

export default function PropertySuccessPage() {
  const params = useSearchParams();
  const propertyId = params.get("propertyId");

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const publicUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
  };

  useEffect(() => {
    if (!propertyId) {
      console.warn("No propertyId found in URL");
      setLoading(false);
      return;
    }
    loadProperty(propertyId);
  }, [propertyId]);

  const loadProperty = async (id: string) => {
    setLoading(true);

    try {
      const { data: prop, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          price,
          town,
          region,
          payment_frequency,
          user_id
        `)
        .eq("id", id)
        .single();

      if (error || !prop) throw new Error("Property not found.");

      const { data: imgs } = await supabase
        .from("property_images")
        .select("image_url, display_order")
        .eq("property_id", id)
        .order("display_order");

      const imageUrls = (imgs ?? []).map((img) => publicUrl(img.image_url)).filter(Boolean);

      const { data: owner } = await supabase
        .from("profiles")
        .select("id, full_name, phone, email")
        .eq("id", prop.user_id)
        .single();

      setProperty({
        ...prop,
        price: Number(prop.price),
        images: imageUrls,
        listedBy: owner || null,
      });
    } catch (err) {
      console.log("Success page load error:", err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!property)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Property not found.
      </div>
    );

  const firstImage = property.images?.[0] ?? "/placeholder.png";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 py-16">
      <div className="text-[#06D6A0] mb-6">
        <CheckCircle size={90} strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">
        Property Posted Successfully!
      </h1>

      <p className="text-gray-600 text-center max-w-lg mb-10">
        Your property is now live. You can track performance, edit details, or improve visibility anytime.
      </p>

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg overflow-hidden mb-10">
        <Image
          src={firstImage}
          width={600}
          height={400}
          alt="Property"
          className="w-full h-60 object-cover"
        />

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{property.title}</h2>
          <p className="text-gray-500 mb-3">
            {property.town}, {property.region}
          </p>

          <p className="text-[#006D77] font-bold text-lg mb-4">
            ₵{property.price.toLocaleString()}/{property.payment_frequency}
          </p>

          <p className="text-xs text-gray-500">
            Listings with high-quality photos receive 3× more inquiries.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href={`/property/${property.id}`}>
          <Button className="px-6 py-3 rounded-xl bg-[#006D77] text-white">
            View Listing
          </Button>
        </Link>

        <Link href={`/dashboard/properties/${property.id}/edit`}>
          <Button variant="outline" className="px-6 py-3 rounded-xl flex items-center gap-2">
            <Edit3 size={18} /> Edit Listing
          </Button>
        </Link>

        <Link href="/dashboard">
          <Button variant="secondary" className="px-6 py-3 rounded-xl flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
