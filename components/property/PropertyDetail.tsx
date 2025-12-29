"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
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
  Eye,
  Clock,
  ShieldCheck,
  ExternalLink,
  Pencil,
  BarChart3,
  Copy,
} from "lucide-react";

import PageHeaders from "@/components/PageHeaders";
import Footer from "@/components/Footer";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      try {
        // lightweight fallback: use alert in the browser for visible feedback, otherwise log
        window.alert(msg);
      } catch {
        console.log("Toast success:", msg);
      }
    } else {
      console.log("Toast success:", msg);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") {
      try {
        // lightweight fallback: use alert in the browser for visible feedback, otherwise error log
        window.alert(msg);
      } catch {
        console.error("Toast error:", msg);
      }
    } else {
      console.error("Toast error:", msg);
    }
  },
};

/* TYPES */
type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string | null;
  email?: string | null;
  created_at?: string;
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
  view_count?: number;
  favorite_count?: number;
  message_count?: number;
};

/* MESSAGE MODAL */
function MessageOwnerModal({
  open,
  onClose,
  ownerId,
  propertyId,
  ownerName,
}: any) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);

    try {
      const { data } = await supabase.auth.getSession();
      const sender_id = data.session?.user?.id;
      if (!sender_id) {
        toast.error("Please login first");
        return;
      }

      const { error } = await supabase.from("messages").insert({
        property_id: propertyId,
        sender_id,
        receiver_id: ownerId,
        message: message.trim(),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setMessage("");
      onClose();
      toast.success("Message sent successfully!");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] p-4 flex items-center justify-center animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center rounded-xl shadow-sm">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contact {ownerName || "Owner"}
              </h2>
              <p className="text-sm text-gray-500">Send a direct message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            rows={5}
            className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all duration-200"
            placeholder={`Hi, I'm interested in this property and would like to know more about...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {message.length}/500
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            disabled={!message.trim() || sending}
            onClick={sendMessage}
            className="px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* IMAGE VIEWER COMPONENT */
function ImageViewer({ images, currentIndex, onIndexChange }: any) {
  const nextImage = () => {
    onIndexChange(
      (images?.length || 0) > 0 ? (currentIndex + 1) % images!.length : 0
    );
  };

  const prevImage = () => {
    onIndexChange(
      (images?.length || 0) > 0
        ? currentIndex === 0
          ? images!.length - 1
          : currentIndex - 1
        : 0
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[55vh] sm:h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[55vh] sm:h-[70vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 group">
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        className="w-full h-full object-cover transition-opacity duration-300"
        alt={`Property image ${currentIndex + 1}`}
        loading="eager"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      {/* Image Counter */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
        <span className="text-white font-semibold text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </>
      )}

      {/* Image Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg">
        {images.map((_: any, i: number) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === currentIndex
                ? "w-8 bg-white shadow-sm"
                : "w-2 bg-white/60 hover:bg-white/80"
            }`}
            onClick={() => onIndexChange(i)}
            aria-label={`View image ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Strip - Desktop */}
      <div className="hidden lg:block absolute bottom-6 left-6 right-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.slice(0, 5).map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                i === currentIndex
                  ? "ring-4 ring-white shadow-xl scale-105"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
              aria-label={`View thumbnail ${i + 1}`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`Thumbnail ${i + 1}`}
                loading="lazy"
              />
              <div
                className={`absolute inset-0 ${
                  i === currentIndex ? "" : "bg-black/30"
                }`}
              />
            </button>
          ))}
          {images.length > 5 && (
            <div className="w-20 h-20 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm">
              +{images.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* CONTACT CARD COMPONENT */
function ContactCard({ property, mode, onMessageClick, onVisitClick }: any) {
  if (mode === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Property Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Property Performance
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Total Views</span>
                <Eye className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-teal-700">
                {property.view_count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Favorites</span>
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700">
                {property.favorite_count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total saves</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Messages</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-700">
                {property.message_count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Inquiries received</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
              onClick={() =>
                (window.location.href = `/dashboard/edit/${property.id}`)
              }
            >
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <Pencil className="w-4 h-4 text-teal-600" />
              </div>
              Edit Property Details
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
              onClick={() => window.open(`/property/${property.id}`, "_blank")}
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </div>
              View Public Page
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-gray-300 hover:bg-gray-50"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/property/${property.id}`
                );
                toast.success("Link copied to clipboard");
              }}
            >
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Copy className="w-4 h-4 text-green-600" />
              </div>
              Copy Property Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          {property.listedBy?.avatar_url ? (
            <img
              src={property.listedBy.avatar_url}
              alt={property.listedBy.full_name || "Owner"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Property Owner</h3>
        <p className="text-lg font-semibold text-gray-700">
          {property.listedBy?.full_name || "Owner"}
        </p>
        {property.listedBy?.created_at && (
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Member since {new Date(property.listedBy.created_at).getFullYear()}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {property.listedBy?.phone && (
          <>
            <a
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group hover:shadow-sm"
              href={`tel:${property.listedBy.phone}`}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <Phone className="text-teal-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900">
                {property.listedBy.phone}
              </span>
            </a>

            <a
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 group hover:shadow-sm"
              href={`https://wa.me/${property.listedBy.phone.replace(
                /\D/g,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <FaWhatsapp className="text-green-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900">WhatsApp</span>
            </a>
          </>
        )}

        {property.listedBy?.email && (
          <a
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group hover:shadow-sm"
            href={`mailto:${property.listedBy.email}`}
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <Mail className="text-blue-600 w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900 truncate">
              {property.listedBy.email}
            </span>
          </a>
        )}
      </div>

      <div className="space-y-3">
        <Button
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={onMessageClick}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Send Message
        </Button>

        <Button
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={onVisitClick}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book Site Visit (₵15)
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
        <Clock className="w-3 h-3" />
        Response time: Usually within 24 hours
      </p>
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
  const [showMobileContact, setShowMobileContact] = useState(false);

  const toPublicUrl = (path: string) => {
    if (!path) return "/placeholder-property.jpg";
    if (path.startsWith("http")) return path;
    const publicUrl = supabase.storage
      .from("property-images")
      .getPublicUrl(path).data.publicUrl;
    return publicUrl || "/placeholder-property.jpg";
  };

  useEffect(() => {
    if (!propertyId) return;
    fetchProperty(propertyId);
  }, [propertyId]);

  const fetchProperty = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch property
      const { data: prop, error: propError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (propError) throw new Error(propError.message);
      if (!prop) throw new Error("Property not found");

      // Fetch images
      const { data: imgs } = await supabase
        .from("property_images")
        .select("*")
        .eq("property_id", id)
        .order("display_order");

      const imageUrls = (imgs ?? [])
        .map((i) => toPublicUrl(i.image_url))
        .filter((url) => url && url !== "/placeholder-property.jpg");

      // Ensure we have at least one image
      if (imageUrls.length === 0) {
        imageUrls.push("/placeholder-property.jpg");
      }

      // Fetch owner profile
      const { data: owner } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", prop.user_id)
        .single();

      // Fetch stats (in a real app, you might have these in separate tables)
      const stats = {
        view_count: 0,
        favorite_count: 0,
        message_count: 0,
      };

      setProperty({
        ...prop,
        images: imageUrls,
        listedBy: owner || null,
        ...stats,
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title || "Check out this property",
      text: property?.description?.substring(0, 100) + "...",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFavorite = async () => {
    if (!property) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error("Please login to save favorites");
      return;
    }

    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? "Removed from favorites" : "Added to favorites"
    );
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-teal-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">
              Loading property details
            </p>
            <p className="text-sm text-gray-500">
              This will just take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ERROR STATE */
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="font-bold text-xl text-gray-900 mb-2">
            Property Not Found
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {error ||
              "The property you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const showPublicUI = mode === "public";

  return (
    <div
      className={`min-h-screen ${
        showPublicUI ? "bg-gray-50" : "bg-transparent"
      }`}
    >
      {showPublicUI && (
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-200">
          <PageHeaders />
        </div>
      )}

      {/* IMAGE VIEWER */}
      <ImageViewer
        images={property.images}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />

      {/* ACTION BAR */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={handleFavorite}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              isFavorited ? "text-red-500 fill-red-500" : "text-gray-700"
            }`}
          />
        </button>

        <button
          className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={handleShare}
          aria-label="Share property"
        >
          <Share2 className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`max-w-7xl mx-auto ${
          showPublicUI ? "px-4 sm:px-6 lg:px-8 py-8 sm:py-12" : ""
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* HEADER CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.available
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {property.available ? "Available" : "Unavailable"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {property.property_type}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {property.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-600 flex-shrink-0" />
                      <span className="font-medium">
                        {property.town}, {property.region}
                      </span>
                    </div>

                    {property.landmark && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">
                          Near {property.landmark}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Rental Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                        ₵{property.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 font-medium">
                        / {property.payment_frequency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {mode === "dashboard" && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                      onClick={() =>
                        router.push(`/dashboard/edit/${property.id}`)
                      }
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Property Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                      onClick={() =>
                        window.open(`/property/${property.id}`, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Public Page
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK INFO CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
                  <Home className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Property Type
                </p>
                <p className="font-bold text-gray-900">
                  {property.property_type}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Listed
                </p>
                <p className="font-bold text-gray-900">
                  {new Date(property.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="font-bold text-gray-900">
                  {property.available ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-teal-600" />
                Property Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* AMENITIES */}
            {!!property.amenities?.length && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  Amenities & Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-teal-200 transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-teal-600 h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - CONTACT CARD */}
          <div className="hidden lg:block relative">
            <div className="sticky top-28">
              <ContactCard
                property={property}
                mode={mode}
                onMessageClick={() => setIsMessageOpen(true)}
                onVisitClick={() => setIsBookingOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CONTACT CARD */}
      {showPublicUI && (
        <>
          {/* Toggle Button */}
          <button
            onClick={() => setShowMobileContact(!showMobileContact)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label={
              showMobileContact
                ? "Hide contact options"
                : "Show contact options"
            }
          >
            {showMobileContact ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
          </button>

          {/* Contact Panel */}
          <div
            className={`
            lg:hidden fixed inset-x-0 bottom-0 bg-white border-t-2 border-gray-200 shadow-2xl z-30 
            transform transition-transform duration-300 ease-in-out
            ${showMobileContact ? "translate-y-0" : "translate-y-full"}
          `}
          >
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                    {property.listedBy?.avatar_url ? (
                      <img
                        src={property.listedBy.avatar_url}
                        alt={property.listedBy.full_name || "Owner"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Owner</p>
                    <p className="font-bold text-gray-900">
                      {property.listedBy?.full_name || "Owner"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {property.listedBy?.phone && (
                  <>
                    <a
                      href={`tel:${property.listedBy.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>

                    <a
                      href={`https://wa.me/${property.listedBy.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg active:scale-95 transition-all duration-200"
                  onClick={() => {
                    setIsMessageOpen(true);
                    setShowMobileContact(false);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                <Button
                  className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg active:scale-95 transition-all duration-200"
                  onClick={() => {
                    setIsBookingOpen(true);
                    setShowMobileContact(false);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Visit
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      <MessageOwnerModal
        open={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        ownerId={property.user_id}
        propertyId={property.id}
        ownerName={property.listedBy?.full_name}
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
