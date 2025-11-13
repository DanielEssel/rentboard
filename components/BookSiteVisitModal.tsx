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
    {
      name: "Breeze",
      price: 15,
      features: ["Visit scheduled", "1 bottle of water"],
    },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) {
      alert("Please select a package before booking!");
      return;
    }
    const pkg = packages.find((p) => p.name === selectedPackage);
    alert(
      `Booking request submitted for ${propertyTitle} with the ${selectedPackage} package for ₵${pkg?.price}!`
    );
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#006D77] to-[#005662] text-white p-6 rounded-t-3xl">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-1 text-center">Book Your Visit</h2>
          <p className="text-white/90 text-sm text-center">{propertyTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: User Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Step 1: Your Info</h3>
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006D77] outline-none text-sm transition-all"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006D77] outline-none text-sm transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006D77] outline-none text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Package Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Step 2: Choose a Package</h3>
            <div className="flex flex-col md:flex-row gap-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`relative flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-300 text-sm ${
                    selectedPackage === pkg.name
                      ? "border-[#006D77] bg-[#006D77]/5 shadow-lg scale-105"
                      : "border-gray-200 hover:border-[#006D77]/40 hover:shadow-sm"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD166] text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.name ? "border-[#006D77] bg-[#006D77]" : "border-gray-300"
                  }`}>
                    {selectedPackage === pkg.name && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <p className="font-bold text-gray-800 text-center">{pkg.name}</p>
                  <p className="text-[#006D77] font-semibold text-center text-lg mb-2">₵{pkg.price}</p>

                  <ul className="space-y-1 text-gray-600 text-xs">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#006D77]" /> {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(pkg.name)}
                    onMouseLeave={() => setShowTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(showTooltip === pkg.name ? null : pkg.name);
                    }}
                    className="absolute bottom-2 right-2 text-gray-400 hover:text-[#006D77] transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {showTooltip === pkg.name && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-2 z-10">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      <p className="font-semibold mb-1">Includes:</p>
                      <ul className="space-y-0.5">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx}>• {feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!selectedPackage}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                selectedPackage
                  ? "bg-[#006D77] hover:bg-[#005662] text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedPackage
                ? `Pay ₵${packages.find((p) => p.name === selectedPackage)?.price} & Confirm Booking`
                : "Select a package to continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
