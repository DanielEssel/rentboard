 "use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  Share2,
  Heart,
  Home,
  Calendar,
  CheckCircle2,
  User,
  Star,
} from "lucide-react";

import PageHeaders from "@/components/PageHeaders";
import Footer from "@/components/Footer";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/* TYPES (unchanged) */
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
  images?: string[];
  listedBy?: Profile | null;
};

type Message = {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

/* ----------------------------- MESSAGE MODAL ----------------------------- */
function MessageOwnerModal({ open, onClose, ownerId, propertyId }: any) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const { data } = await supabase.auth.getSession();
      const sender_id = data.session?.user?.id;
      if (!sender_id) return alert("Please login first.");

      const { error } = await supabase.from("messages").insert({
        property_id: propertyId,
        sender_id,
        receiver_id: ownerId,
        message: message.trim(),
      });

      if (error) {
        alert(error.message);
        return;
      }

      setMessage("");
      onClose();
      alert("Message sent!");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in fade-in">
        <div className="flex gap-3 items-center mb-4">
          <div className="w-10 h-10 bg-teal-100 flex items-center justify-center rounded-full">
            <MessageSquare className="text-teal-600" />
          </div>
          <h2 className="text-lg font-bold">Message Owner</h2>
        </div>

        <textarea
          rows={4}
          className="w-full border rounded-xl p-3"
          placeholder="Hi, I’m interested in this property..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!message.trim()} onClick={sendMessage}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- MAIN COMPONENT --------------------------- */
export default function PropertyDetail({
  propertyId,
  mode = "public",
}: {
  propertyId: string;
  mode?: "public" | "dashboard";
}) {
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const toPublicUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
  };

  useEffect(() => {
    if (!propertyId) return;
    fetchProperty(propertyId);
  }, [propertyId]);

  const fetchProperty = async (id: string) => {
    setLoading(true);

    try {
      const { data: prop } = await supabase.from("properties").select("*").eq("id", id).single();
      if (!prop) throw new Error("Not found");

      const { data: imgs } = await supabase
        .from("property_images")
        .select("*")
        .eq("property_id", id)
        .order("display_order");

      const imageUrls = (imgs ?? []).map((i) => toPublicUrl(i.image_url));

      const { data: owner } = await supabase.from("profiles").select("*").eq("id", prop.user_id).single();

      setProperty({
        ...prop,
        images: imageUrls,
        listedBy: owner || null,
      });
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const nextImage = () =>
    property?.images &&
    setCurrentImageIndex((i) => (i + 1) % property.images!.length);

  const prevImage = () =>
    property?.images &&
    setCurrentImageIndex((i) => (i === 0 ? property.images!.length - 1 : i - 1));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        url: window.location.href,
      });
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  /* --------------------- LOADING --------------------- */
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );

  if (!property)
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-xl shadow text-center max-w-sm">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-bold text-lg">Property Not Found</p>
        </div>
      </div>
    );

  const showPublicUI = mode === "public";

  /* ---------------------------- RENDER ---------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {showPublicUI && (
        <div className="sticky top-0 bg-white/80 backdrop-blur z-20 border-b">
          <PageHeaders />
        </div>
      )}

      {/* ---------------- IMAGE HERO ---------------- */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden bg-black">
        <img
          src={property.images?.[currentImageIndex]}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />

        {/* MOBILE TOP BUTTONS */}
        <div className="absolute top-4 right-4 flex gap-2 sm:hidden">
          <button
            className="bg-white/90 p-2 rounded-full shadow"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
          </button>

          <button
            className="bg-white/90 p-2 rounded-full shadow"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Desktop Arrows */}
        {property.images!.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {property.images?.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentImageIndex ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* ---------------- MAIN CONTENT GRID (Desktop) ---------------- */}
<div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-[1fr_320px] gap-10">

  {/* ---------------- LEFT: Property Content ---------------- */}
  <div className="space-y-8">

    {/* Title + price */}
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl sm:text-3xl font-bold">{property.title}</h1>

      <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
        <MapPin className="h-4 w-4 text-teal-600" />
        {property.town}, {property.region}
      </div>

      <div className="mt-4">
        <p className="text-gray-500 text-sm">Price</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl sm:text-4xl font-bold text-teal-600">
            ₵{property.price.toLocaleString()}
          </span>
          <span className="text-gray-500 mb-1">/ {property.payment_frequency}</span>
        </div>
      </div>

      {mode === "dashboard" && (
        <Button
          className="mt-6"
          onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}
        >
          Edit Property Details
        </Button>
      )}
    </div>

    {/* Quick Info */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl shadow-sm text-center">
        <Home className="h-6 w-6 mx-auto text-teal-600 mb-2" />
        <p className="text-sm text-gray-500">Property Type</p>
        <p className="font-semibold">{property.property_type}</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-center">
        <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
        <p className="text-sm text-gray-500">Listed</p>
        <p className="font-semibold">
          {new Date(property.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-center">
        <Star className="h-6 w-6 mx-auto text-purple-600 mb-2" />
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-semibold">{property.available ? "Available" : "Unavailable"}</p>
      </div>
    </div>

    {/* Description */}
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-3">Description</h2>
      <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
    </div>

    {/* Amenities */}
    {!!property.amenities?.length && (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Amenities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {property.amenities.map((a) => (
            <div key={a} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="text-teal-600 h-5 w-5" />
              <span className="font-medium">{a}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* ---------------- RIGHT: Desktop Floating Contact Card ---------------- */}
  {showPublicUI && (
    <div className="hidden sm:block">
      <div className="sticky top-28">
        <div className="bg-white p-8 rounded-xl shadow-md w-full">
          <h3 className="text-xl font-bold mb-3">Contact Owner</h3>

          <p className="font-semibold mb-4">{property.listedBy?.full_name}</p>

          <div className="space-y-3">
            {property.listedBy?.phone && (
              <a
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                href={`tel:${property.listedBy.phone}`}
              >
                <Phone className="text-teal-600" />
                {property.listedBy.phone}
              </a>
            )}

            {property.listedBy?.email && (
              <a
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                href={`mailto:${property.listedBy.email}`}
              >
                <Mail className="text-blue-600" />
                {property.listedBy.email}
              </a>
            )}

            {property.listedBy?.phone && (
              <a
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                href={`https://wa.me/${property.listedBy.phone}`}
                target="_blank"
              >
                <MessageSquare className="text-green-600" />
                WhatsApp
              </a>
            )}
          </div>

          <Button className="mt-6 w-full" onClick={() => setIsMessageOpen(true)}>
            Send Message
          </Button>

          <Button
            className="mt-3 w-full bg-yellow-500 text-white"
            onClick={() => setIsBookingOpen(true)}
          >
            Book Site Visit (₵15)
          </Button>
        </div>
      </div>
    </div>
  )}
</div>


      <MessageOwnerModal
        open={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        ownerId={property.user_id}
        propertyId={property.id}
      />

      <BookSiteVisitModal
        propertyTitle={property.title}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
      />

      {showPublicUI && <Footer />}
    </div>
  );
}
