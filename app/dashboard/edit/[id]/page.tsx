"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types matching your schema
interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  price: number;
  payment_frequency: "monthly" | "yearly" | "negotiable";
  available: boolean;
  region: string;
  town: string;
  landmark: string | null;
  amenities: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
}

const PROPERTY_TYPES = [
  "Apartment",
  "Single Room",
  "Self-Contained",
  "Hostel",
  "House",
];

const PAYMENT_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "negotiable", label: "Negotiable" },
];

const AMENITIES_OPTIONS = [
  "WiFi",
  "Water",
  "Electricity",
  "Parking",
  "AC",
  "Security",
  "Kitchen",
  "Furnished",
];

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [town, setTown] = useState("");
  const [region, setRegion] = useState("");
  const [landmark, setLandmark] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [paymentFrequency, setPaymentFrequency] = useState<
    "monthly" | "yearly" | "negotiable"
  >("monthly");
  const [available, setAvailable] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([]);

  // New images (before upload)
  const [newImages, setNewImages] = useState<File[]>([]);

  // Delete modal
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("properties")
        .select("*, property_images(id, image_url, property_id)")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setProperty(data as Property);
        setImages((data.property_images || []) as PropertyImage[]);

        // Populate form
        setTitle(data.title);
        setTown(data.town);
        setRegion(data.region);
        setLandmark(data.landmark || "");
        setPrice(data.price.toString());
        setDescription(data.description);
        setPropertyType(data.property_type);
        setPaymentFrequency(data.payment_frequency);
        setAvailable(data.available ?? true);
        setAmenities(data.amenities || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load property");
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload Files
  const handleImageUpload = async () => {
    if (newImages.length === 0) return;

    const uploadPromises = newImages.map(async (file) => {
      const filePath = `${id}/${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const publicUrl = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath).data.publicUrl;

      const { error: insertError } = await supabase
        .from("property_images")
        .insert({
          property_id: id,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;
    });

    await Promise.all(uploadPromises);
  };

  // Delete image
  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/property-images/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("property-images").remove([filePath]);
      }

      const { error } = await supabase
        .from("property_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      // Remove from UI
      setImages(images.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setError(err.message || "Failed to delete image");
      console.error("Error deleting image:", err);
    }
  };

  // Save Property
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validation
      if (!title.trim() || !town.trim() || !region.trim() || !description.trim()) {
        throw new Error("Please fill in all required fields");
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error("Please enter a valid price");
      }

      // Upload new images first
      await handleImageUpload();

      // Update property
      const { error: updateError } = await supabase
        .from("properties")
        .update({
          title: title.trim(),
          town: town.trim(),
          region: region.trim(),
          landmark: landmark.trim() || null,
          price: priceNum,
          description: description.trim(),
          property_type: propertyType,
          payment_frequency: paymentFrequency,
          available,
          amenities,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save property");
      console.error("Error saving property:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Listing
  const handleDeleteListing = async () => {
    try {
      setDeleting(true);
      setError(null);

      // Delete images from storage
      for (const img of images) {
        const urlParts = img.image_url.split("/property-images/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from("property-images").remove([filePath]);
        }
      }

      // Delete property (CASCADE will handle property_images table)
      const { error: deleteError } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to delete property");
      console.error("Error deleting property:", err);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6">
        <Alert variant="destructive">
          <AlertDescription>Property not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* IMAGES */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Property Images</h2>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <Image
                    src={img.image_url}
                    width={300}
                    height={200}
                    alt="Property Image"
                    className="rounded-lg object-cover h-40 w-full"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id, img.image_url)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No images uploaded yet</p>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Add More Images
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setNewImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            {newImages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {newImages.length} new image(s) selected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FORM */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Spacious 2 Bedroom Apartment"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Town *</label>
              <Input
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g., Accra"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region *</label>
              <Input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Greater Accra"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Landmark (Optional)
              </label>
              <Input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Near KNUST"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Type *
            </label>
            <Select onValueChange={setPropertyType} value={propertyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price & Payment Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (GHS) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 1500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Frequency *
              </label>
              <Select
                onValueChange={(val) =>
                  setPaymentFrequency(val as "monthly" | "yearly" | "negotiable")
                }
                value={paymentFrequency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property..."
              className="h-32"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={amenities.includes(amenity) ? "default" : "outline"}
                  onClick={() => toggleAmenity(amenity)}
                  className={
                    amenities.includes(amenity)
                      ? "bg-[#006D77] hover:bg-[#005560]"
                      : ""
                  }
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 text-[#006D77] rounded"
            />
            <label htmlFor="available" className="text-sm font-medium">
              Property is available for rent
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              className="w-full bg-[#006D77] hover:bg-[#005560] text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
              disabled={deleting}
            >
              Delete Listing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this property?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            This action cannot be undone. This will permanently delete the
            property and all associated images.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteListing}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}