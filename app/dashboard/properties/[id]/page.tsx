"use client";

import React from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/properties"
              className="flex items-center gap-2 text-gray-600 hover:text-[#006D77] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#006D77] flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium hidden sm:inline">Back to Properties</span>
              <span className="font-medium sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PropertyDetail propertyId={id} mode="dashboard" />
      </div>
    </div>
  );
}