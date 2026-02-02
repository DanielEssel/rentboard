"use client";

import { useState } from "react";
import { X, Calendar, Phone, User, Check, Info } from "lucide-react";

interface BookSiteVisitModalProps {
  propertyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Package {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export default function BookSiteVisitModal({
  propertyTitle,
  open,
  onOpenChange,
}: BookSiteVisitModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
  });

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const packages: Package[] = [
    { name: "Breeze", price: 15, features: ["Visit scheduled", "1 bottle of water"] },
    {
      name: "Glide",
      price: 25,
      features: ["Visit scheduled", "Pick-up & drop-off", "Bottled water"],
      popular: true,
    },
    {
      name: "Summit",
      price: 35,
      features: ["Visit scheduled", "Transport included", "Refreshments", "Property brochure"],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return alert("Please select a package!");

    const pkg = packages.find((p) => p.name === selectedPackage);
    alert(`Booking request submitted for ${propertyTitle} with ${pkg?.name} — ₵${pkg?.price}`);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#006D77] to-[#005662] text-white p-6 rounded-t-2xl">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-center">Book a Visit</h2>
          <p className="text-white/90 text-sm sm:text-base text-center mt-1">{propertyTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">

          {/* Step 1 */}
          <div>
            <h3 className="text-gray-700 text-base font-semibold mb-3">
              Step 1: Your Information
            </h3>

            <div className="space-y-3">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#006D77] text-sm sm:text-base outline-none"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#006D77] text-sm sm:text-base outline-none"
                />
              </div>

              {/* Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#006D77] text-sm sm:text-base outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <h3 className="text-gray-700 text-base font-semibold mb-3">
              Step 2: Select a Package
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`relative p-4 rounded-xl border text-sm sm:text-base cursor-pointer transition-all
                    ${selectedPackage === pkg.name
                      ? "border-[#006D77] bg-[#006D77]/10 shadow-md scale-[1.02]"
                      : "border-gray-300 hover:border-[#006D77]/40"}
                  `}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD166] text-gray-900 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Popular
                    </div>
                  )}

                  {/* Selection Circle */}
                  <div
                    className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedPackage === pkg.name ? "border-[#006D77] bg-[#006D77]" : "border-gray-300"}
                    `}
                  >
                    {selectedPackage === pkg.name && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Title + Price */}
                  <p className="font-bold text-gray-800 text-center">{pkg.name}</p>
                  <p className="text-[#006D77] font-semibold text-center text-lg mb-2">₵{pkg.price}</p>

                  {/* Features */}
                  <ul className="space-y-1 text-gray-600 text-xs">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#006D77]" /> {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Tooltip Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(showTooltip === pkg.name ? null : pkg.name);
                    }}
                    className="absolute bottom-2 right-2 text-gray-400 hover:text-[#006D77]"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {/* Tooltip */}
                  {showTooltip === pkg.name && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3">
                      <p className="font-semibold mb-1">Includes:</p>
                      <ul className="space-y-0.5">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx}>• {feat}</li>
                        ))}
                      </ul>

                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedPackage}
            className={`w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-all
              ${
                selectedPackage
                  ? "bg-[#006D77] hover:bg-[#005662] text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {selectedPackage
              ? `Pay ₵${packages.find((p) => p.name === selectedPackage)?.price} & Confirm`
              : "Select a package to continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
