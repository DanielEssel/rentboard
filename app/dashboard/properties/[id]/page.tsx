"use client";

import React from "react";
import PropertyDetail from "@/components/property/PropertyDetail";

export default function DashboardPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <div className="p-6">
      <PropertyDetail propertyId={id} mode="dashboard" />
    </div>
  );
}
