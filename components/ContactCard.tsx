
import { BarChart3, Calendar, Clock, Copy, ExternalLink, Heart, Mail, MessageSquare, Pencil, Phone, ShieldCheck, TrendingUp, User, Eye, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";


export const ContactCard = ({ property, mode, onMessageClick, onVisitClick }: any) => {
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
                <MessageCircle className="text-green-600 w-5 h-5" />
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