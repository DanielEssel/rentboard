import PropertyDetail from "@/components/property/PropertyDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PropertyDetail propertyId={id} mode="public" />;
}
