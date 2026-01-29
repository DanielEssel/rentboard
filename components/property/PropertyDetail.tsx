"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  AlertCircle,
  Heart,
  Home,
  Calendar,
  CheckCircle2,
  User,
  X,
  Eye,
  Clock,
  ShieldCheck,
  ExternalLink,
  Pencil,
  BarChart3,
  Copy,
  TrendingUp,
} from "lucide-react";

// Type definitions
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  payment_frequency: string;
  property_type: string;
  town: string;
  region: string;
  landmark?: string;
  available: boolean;
  images?: string[];
  amenities?: string[];
  created_at: string;
  user_id: string;
  view_count?: number;
  favorite_count?: number;
  message_count?: number;
  listedBy?: {
    full_name?: string;
    phone?: string;
    email?: string;
  };
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface PropertyDetailProps {
  propertyId: string;
  mode?: "public" | "dashboard";
}

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// Utility Components
const Button = ({ children, variant = "default", className = "", ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const toast = {
  success: (msg: string) => alert(msg),
  error: (msg: string) => alert(msg),
};

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
    <div className="max-w-7xl mx-auto text-center">
      <p className="text-gray-400">© 2025 PropertyHub. All rights reserved.</p>
    </div>
  </footer>
);

// Modal Components
const BookSiteVisitModal = ({ open, onOpenChange, propertyTitle }: any) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Book Site Visit</h3>
        <p className="text-gray-600 mb-6">Schedule a visit for {propertyTitle}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Confirm Booking</Button>
        </div>
      </div>
    </div>
  );
};

const MessageOwnerModal = ({ open, onClose, ownerId, propertyId, ownerName }: any) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setMessage("");
      onClose();
      toast.success("Message sent successfully!");
      setSending(false);
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center rounded-xl">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contact {ownerName || "Owner"}</h2>
              <p className="text-sm text-gray-500">Send a direct message</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
          <textarea
            rows={5}
            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            placeholder="Hi, I'm interested in this property and would like to know more about..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">{message.length}/500</div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!message.trim() || sending} onClick={sendMessage}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Image Viewer Component
const ImageViewer = ({ images, currentIndex, onIndexChange }: any) => {
  const nextImage = () => {
    onIndexChange((images?.length || 0) > 0 ? (currentIndex + 1) % images!.length : 0);
  };

  const prevImage = () => {
    onIndexChange((images?.length || 0) > 0 ? (currentIndex === 0 ? images!.length - 1 : currentIndex - 1) : 0);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-900 group">
      <img
        src={images[currentIndex]}
        className="w-full h-full object-cover"
        alt={`Property image ${currentIndex + 1}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <span className="text-gray-900 font-semibold text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full">
        {images.map((_: any, i: number) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
            }`}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ property, mode, onMessageClick, onVisitClick }: any) => {
  if (mode === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Performance Metrics
          </h3>

          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Views</span>
                <Eye className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-teal-700">{property.view_count || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-teal-600" />
                <p className="text-xs text-teal-600 font-medium">+12% vs last month</p>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Favorites</span>
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700">{property.favorite_count || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Total saves</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Messages</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-700">{property.message_count || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Inquiries received</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Pencil className="w-4 h-4 text-teal-600" />
              Edit Property
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              View Public Page
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Copy className="w-4 h-4 text-green-600" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="text-center mb-6 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Property Owner</h3>
        <p className="text-base font-semibold text-gray-700">{property.listedBy?.full_name || "Owner"}</p>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          Verified Member
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {property.listedBy?.phone && (
          <>
            <a
              href={`tel:${property.listedBy.phone}`}
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Phone className="text-teal-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900">{property.listedBy.phone}</span>
            </a>

            <a
              href={`https://wa.me/${property.listedBy.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <WhatsAppIcon className="text-green-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900">WhatsApp</span>
            </a>
          </>
        )}

        {property.listedBy?.email && (
          <a
            href={`mailto:${property.listedBy.email}`}
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Mail className="text-blue-600 w-5 h-5" />
            </div>
            <span className="font-medium text-gray-900 truncate">{property.listedBy.email}</span>
          </a>
        )}
      </div>

      <div className="space-y-3">
        <Button className="w-full h-12 text-base font-semibold" onClick={onMessageClick}>
          <MessageSquare className="w-5 h-5 mr-2" />
          Send Message
        </Button>

        <Button className="w-full h-12 text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-gray-900" onClick={onVisitClick}>
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
};

// Back Button Component
const BackButton = () => (
  <button
    onClick={() => window.history.back()}
    className="fixed top-6 left-6 z-50 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
  >
    <ChevronLeft className="w-6 h-6 text-gray-900" />
  </button>
);



// Main Component
export default function PropertyDetail({ propertyId, mode = "public" }: PropertyDetailProps) {
  // State declarations
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showMobileContact, setShowMobileContact] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading property...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">
            {error || "Property not found"}
          </p>
        </div>
      </div>
    );
  }

  // Main render
  const showPublicUI = mode === "public";
  return (
    <div className={`min-h-screen ${showPublicUI ? "bg-gray-50" : ""}`}>
      <BackButton />

      <ImageViewer 
        images={property.images ?? []} 
        currentIndex={currentImageIndex} 
        onIndexChange={setCurrentImageIndex}
      />

      <div className="absolute top-[420px] sm:top-[520px] lg:top-[620px] right-6 flex gap-2 z-40">
        <button
          onClick={handleFavorite}
          className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
        </button>

        <button 
          onClick={handleShare} 
          className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
        >
          <Share2 className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div className={`max-w-7xl mx-auto ${showPublicUI ? "px-4 sm:px-6 lg:px-8 py-8 lg:py-12" : ""}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {property.available ? "Available" : "Unavailable"}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{property.property_type}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {property.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      <span className="font-medium">
                        {property.town}, {property.region}
                      </span>
                    </div>

                    {property.landmark && (
                      <span className="text-sm text-gray-500">• Near {property.landmark}</span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Rental Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-teal-600">
                      ₵{property.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500">/ {property.payment_frequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
                  <Home className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Type</p>
                <p className="font-bold text-gray-900">{property.property_type}</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Listed</p>
                <p className="font-bold text-gray-900">
                  {new Date(property.created_at).toLocaleDateString("en-US", { 
                    month: "short", 
                    year: "numeric" 
                  })}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Status</p>
                <p className="font-bold text-gray-900">{property.available ? "Available" : "Rented"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-teal-600" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  Amenities & Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="text-teal-600 h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Contact Card */}
          <div className="hidden lg:block">
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

      {/* Mobile Contact Button & Panel */}
      {showPublicUI && (
        <>
          <button
            onClick={() => setShowMobileContact(!showMobileContact)}
            className="lg:hidden fixed bottom-6 right-6 z-[100] bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            {showMobileContact ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>

          <div className={`lg:hidden fixed inset-x-0 bottom-0 bg-white border-t-2 border-gray-200 shadow-2xl z-[90] transform transition-transform duration-300 ${
            showMobileContact ? "translate-y-0" : "translate-y-full"
          }`}>
            <div className="px-4 py-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Owner</p>
                  <p className="font-bold text-gray-900">{property.listedBy?.full_name || "Owner"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {property.listedBy?.phone && (
                  <>
                    <a 
                      href={`tel:${property.listedBy.phone}`} 
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <a 
                      href={`https://wa.me/${property.listedBy.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
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

      {/* Modals */}
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
function toPublicUrl(image_url: string): string {
  if (!image_url) return "";
  // If already an absolute URL, return as is
  if (/^https?:\/\//.test(image_url)) return image_url;
  // If it's a Supabase Storage path, convert to public URL
  // Example: "property-images/abc.jpg" => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/abc.jpg`
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (SUPABASE_URL && image_url.includes("/")) {
    return `${SUPABASE_URL}/storage/v1/object/public/${image_url}`;
  }
  // Fallback: return as is
  return image_url;
}

