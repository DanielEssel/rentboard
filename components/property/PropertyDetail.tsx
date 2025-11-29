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
  X,
} from "lucide-react";

import PageHeaders from "@/components/PageHeaders";
import Footer from "@/components/Footer";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/* TYPES */
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

/* MESSAGE MODAL */
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center rounded-xl shadow-sm">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contact Owner</h2>
              <p className="text-sm text-gray-500">Send a direct message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <textarea
          rows={5}
          className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          placeholder="Hi, I'm interested in this property and would like to know more about..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            disabled={!message.trim() || sending}
            onClick={sendMessage}
            className="px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* MAIN COMPONENT */
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
    if (!path) return "/placeholder-property.jpg"; // Fallback image
    if (path.startsWith("http")) return path;
    const publicUrl = supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;
    return publicUrl || "/placeholder-property.jpg";
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

      const imageUrls = (imgs ?? []).map((i) => toPublicUrl(i.image_url)).filter(url => url && url !== "/placeholder-property.jpg");

      // Ensure we have at least one image
      if (imageUrls.length === 0) {
        imageUrls.push("/placeholder-property.jpg");
      }

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

  /* LOADING */
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading property details...</p>
      </div>
    );

  if (!property)
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-bold text-xl text-gray-900 mb-2">Property Not Found</p>
          <p className="text-gray-500 text-sm">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );

  const showPublicUI = mode === "public";

  /* RENDER */
  return (
    <div className={`min-h-screen ${showPublicUI ? 'bg-gray-50 pb-20 lg:pb-0' : 'bg-transparent'}`}>
      {showPublicUI && (
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-200">
          <PageHeaders />
        </div>
      )}

      {/* IMAGE HERO */}
      <div className="relative w-full h-[55vh] sm:h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {property.images?.[currentImageIndex] ? (
          <img
            src={property.images[currentImageIndex]}
            className="w-full h-full object-cover"
            alt={property.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Home className="w-20 h-20 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* IMAGE COUNTER BADGE */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
          <span className="text-white font-semibold text-sm">
            {currentImageIndex + 1} / {property.images?.length || 0}
          </span>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-105"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`h-5 w-5 transition-all ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
          </button>

          <button
            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-105"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* NAVIGATION ARROWS - Enhanced */}
        {property.images!.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </>
        )}

        {/* IMAGE INDICATORS - Enhanced */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg">
          {property.images?.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentImageIndex ? "w-8 bg-white shadow-sm" : "w-2 bg-white/60 hover:bg-white/80"
              }`}
              onClick={() => setCurrentImageIndex(i)}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>

        {/* THUMBNAIL STRIP - Desktop Only */}
        <div className="hidden lg:block absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {property.images?.slice(0, 5).map((img, i) => (
              img && (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    i === currentImageIndex 
                      ? "ring-4 ring-white shadow-xl scale-105" 
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                  <div className={`absolute inset-0 ${i === currentImageIndex ? "" : "bg-black/30"}`} />
                </button>
              )
            ))}
            {property.images && property.images.length > 5 && (
              <div className="w-20 h-20 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm">
                +{property.images.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`${showPublicUI ? 'max-w-7xl' : 'max-w-7xl'} mx-auto ${showPublicUI ? 'px-4 sm:px-6 lg:px-8 py-8 sm:py-12' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* HEADER CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {property.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      <span className="font-medium">{property.town}, {property.region}</span>
                    </div>
                    
                    {property.landmark && (
                      <span className="text-sm text-gray-500">• Near {property.landmark}</span>
                    )}
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  property.available 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                  {property.available ? "Available" : "Unavailable"}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Rental Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                    ₵{property.price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 font-medium">/ {property.payment_frequency}</span>
                </div>
              </div>

              {mode === "dashboard" && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                      onClick={() => router.push(`/dashboard/edit/${property.id}`)}
                    >
                      Edit Property Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                      onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    >
                      View Public Page
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK INFO CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
                  <Home className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Property Type</p>
                <p className="font-bold text-gray-900">{property.property_type}</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Listed</p>
                <p className="font-bold text-gray-900">
                  {new Date(property.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                <p className="font-bold text-gray-900">{property.available ? "Available" : "Unavailable"}</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* AMENITIES */}
            {!!property.amenities?.length && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-teal-600 h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - CONTACT CARD OR DASHBOARD STATS */}
          {showPublicUI ? (
            <div className="hidden lg:block relative">
              <div className="sticky top-28">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="text-center mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Property Owner</h3>
                    <p className="text-lg font-semibold text-gray-700">{property.listedBy?.full_name || "Owner"}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {property.listedBy?.phone && (
                      <>
                        <a
                          className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                          href={`tel:${property.listedBy.phone}`}
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                            <Phone className="text-teal-600 w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900">{property.listedBy.phone}</span>
                        </a>

                        <a
                          className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                          href={`https://wa.me/${property.listedBy.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                            <MessageSquare className="text-green-600 w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900">WhatsApp</span>
                        </a>
                      </>
                    )}

                    {property.listedBy?.email && (
                      <a
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                        href={`mailto:${property.listedBy.email}`}
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                          <Mail className="text-blue-600 w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900 truncate">{property.listedBy.email}</span>
                      </a>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setIsMessageOpen(true)}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>

                    <Button
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Site Visit (₵15)
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Response time: Usually within 24 hours
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:block relative">
              <div className="sticky top-28 space-y-6">
                {/* Property Stats Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-teal-600" />
                    Property Performance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <Heart className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-3xl font-bold text-teal-700">0</p>
                      <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Favorites</span>
                        <Heart className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-700">0</p>
                      <p className="text-xs text-gray-500 mt-1">Total saves</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Messages</span>
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-700">0</p>
                      <p className="text-xs text-gray-500 mt-1">Inquiries received</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
                      onClick={() => router.push(`/dashboard/edit/${property.id}/edit`)}
                    >
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-teal-600" />
                      </div>
                      Edit Details
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
                      onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </div>
                      View Public Page
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
                      onClick={handleShare}
                    >
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-green-600" />
                      </div>
                      Share Property
                    </Button>
                  </div>
                </div>

                {/* Property Status Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">PROPERTY STATUS</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Availability</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.available 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {property.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Listed On</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(property.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Updated</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(property.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE FLOATING CONTACT CARD */}
          {showPublicUI && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40 transform transition-transform duration-300">
              <div className="px-4 py-4">
                {/* Owner Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Property Owner</p>
                      <p className="font-bold text-gray-900">{property.listedBy?.full_name || "Owner"}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {property.listedBy?.phone && (
                    <>
                      <a
                        href={`tel:${property.listedBy.phone}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>

                      <a
                        href={`https://wa.me/${property.listedBy.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg active:scale-95"
                    onClick={() => setIsMessageOpen(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>

                  <Button
                    className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg active:scale-95"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Visit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
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