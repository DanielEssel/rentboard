"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

const PROPERTY_TYPES = [
  "Apartment",
  "Single Room",
  "Self-Contained",
  "Hostel",
  "House",
]

const PAYMENT_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "negotiable", label: "Negotiable" },
]

const AMENITIES_OPTIONS = [
  "WiFi",
  "Water",
  "Electricity",
  "Parking",
  "AC",
  "Security",
  "Kitchen",
  "Furnished",
  "Laundry",
  "Balcony",
]

export default function AddPropertyPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState("")
  const [propertyType, setPropertyType] = useState("Apartment")
  const [price, setPrice] = useState("")
  const [paymentFrequency, setPaymentFrequency] = useState<"monthly" | "yearly" | "negotiable">("monthly")
  const [region, setRegion] = useState("")
  const [town, setTown] = useState("")
  const [landmark, setLandmark] = useState("")
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [available, setAvailable] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validImages = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files")
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB")
        return false
      }
      return true
    })

    if (images.length + validImages.length > 10) {
      setError("Maximum 10 images allowed")
      return
    }

    setImages([...images, ...validImages])
    validImages.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    setError(null)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const uploadImages = async (propertyId: string): Promise<string[]> => {
    const uploadedUrls: string[] = []
    for (const file of images) {
      const fileExt = file.name.split(".").pop()
      const filePath = `${propertyId}/${Date.now()}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from("property-images").upload(filePath, file)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from("property-images").getPublicUrl(filePath)
      uploadedUrls.push(publicUrl)
    }
    return uploadedUrls
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!title.trim()) throw new Error("Property title is required")
      if (!town.trim()) throw new Error("Town is required")
      if (!region.trim()) throw new Error("Region is required")
      if (!description.trim()) throw new Error("Description is required")

      const priceNum = parseFloat(price)
      if (isNaN(priceNum) || priceNum <= 0) throw new Error("Please enter a valid price")
      if (images.length === 0) throw new Error("Please upload at least one image")

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to add a property")

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert([{
          user_id: user.id,
          title: title.trim(),
          property_type: propertyType,
          price: priceNum,
          payment_frequency: paymentFrequency,
          region: region.trim(),
          town: town.trim(),
          landmark: landmark.trim() || null,
          description: description.trim(),
          amenities,
          available,
        }])
        .select()
        .single()

      if (propertyError) throw propertyError

      const imageUrls = await uploadImages(property.id)
      const imageRecords = imageUrls.map((url) => ({ property_id: property.id, image_url: url }))
      const { error: imagesError } = await supabase.from("property_images").insert(imageRecords)
      if (imagesError) throw imagesError

      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create property")
      console.error("Error creating property:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-12 text-center">
            <div className="mb-6 inline-block p-6 bg-emerald-100 rounded-full">
              <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Listed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your property has been added and is now live. Redirecting to dashboard...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="rounded-full w-10 h-10 p-0">←</Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#006D77] to-[#83C5BE] bg-clip-text text-transparent">List Your Property</h1>
          <p className="text-gray-600">Fill in the details to add a new property</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
          <p className="text-sm text-gray-600 mb-4">Upload up to 10 images (max 5MB each)</p>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image src={preview} alt={`Preview ${index + 1}`} width={200} height={150} className="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                  <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          )}

          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#006D77] transition-colors cursor-pointer">
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG (max 5MB each)</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
          </label>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Property Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Spacious 2 Bedroom Apartment in East Legon" disabled={loading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
              <Select onValueChange={setPropertyType} value={propertyType} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency *</label>
              <Select onValueChange={(val) => setPaymentFrequency(val as "monthly" | "yearly" | "negotiable")} value={paymentFrequency} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (GHS) *</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 1500" min="0" step="0.01" disabled={loading} />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Town *</label>
                <Input value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g., Accra" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
                <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., Greater Accra" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g., Near KNUST" disabled={loading} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your property in detail..." className="h-32" disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <Button key={amenity} type="button" variant={amenities.includes(amenity) ? "default" : "outline"} onClick={() => toggleAmenity(amenity)} disabled={loading} className={amenities.includes(amenity) ? "bg-[#006D77] hover:bg-[#005560]" : ""}>
                  {amenity}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <input type="checkbox" id="available" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="w-4 h-4 text-[#006D77] rounded" disabled={loading} />
            <label htmlFor="available" className="text-sm font-medium">Property is available for rent</label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-[#006D77] to-[#005560]">
        <CardContent className="p-6">
          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-[#006D77] hover:bg-gray-100 font-semibold text-lg h-12">
            {loading ? "Creating Property..." : "Add Property"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}