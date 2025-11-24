"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {  Image as ImageIcon, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeaders from "@/components/PageHeaders";
import { createProperty } from "@/lib/propertyApi";
import { supabase } from "@/lib/supabase/client";

type PropertyType =
  | "Apartment"
  | "Single Room"
  | "Self Contained"
  | "Store"
  | "Office"
  | "Other";

type FormState = {
  title: string;
  propertyType: PropertyType | "";
  price: string;
  paymentFrequency: "monthly" | "yearly" | "negotiable";
  available: boolean;
  region: string;
  town: string;
  landmark: string;
  amenities: string[];
  description: string;
  images: File[];
};

const MAX_IMAGES = 5;
const PROPERTY_TYPES: PropertyType[] = [
  "Apartment",
  "Single Room",
  "Self Contained",
  "Store",
  "Office",
  "Other",
];

const AMENITIES = [
  "Water",
  "Electricity",
  "Parking",
  "Toilet Inside",
  "Balcony",
  "Security",
  "Furnished",
];

export default function PostPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    propertyType: "",
    price: "",
    paymentFrequency: "monthly",
    available: true,
    region: "",
    town: "",
    landmark: "",
    amenities: [],
    description: "",
    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  // Protected Route: Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to login with return URL
          router.push('/auth/login?returnTo=/list-property');
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login?returnTo=/list-property');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const urls = form.images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [form.images]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((s) =>
      s.amenities.includes(amenity)
        ? { ...s, amenities: s.amenities.filter((a) => a !== amenity) }
        : { ...s, amenities: [...s.amenities, amenity] }
    );
  };

  const onPickImages = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files).slice(0, MAX_IMAGES);
    const combined = [...form.images, ...incoming].slice(0, MAX_IMAGES);
    update("images", combined);
  };

  const removeImage = (index: number) => {
    const newImgs = [...form.images];
    newImgs.splice(index, 1);
    update("images", newImgs);
  };

  const validateStep = (s = step) => {
    const err: Record<string, string> = {};
    if (s === 1) {
      if (!form.title || form.title.trim().length < 6)
        err.title = "Please enter a descriptive title.";
      if (!form.propertyType) err.propertyType = "Select a property type.";
      if (!form.price || Number.isNaN(Number(form.price)))
        err.price = "Enter a valid price.";
    } else if (s === 2) {
      if (!form.region) err.region = "Region is required.";
      if (!form.town) err.town = "Town / Community is required.";
    } else if (s === 3) {
      if (!form.description || form.description.trim().length < 15)
        err.description = "Provide a helpful description.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((p) => Math.min(3, p + 1));
  };
  const back = () => setStep((p) => Math.max(1, p - 1));

  const submitProperty = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      await createProperty({
        title: form.title,
        property_type: form.propertyType as string,
        price: parseFloat(form.price),
        payment_frequency: form.paymentFrequency,
        available: form.available,
        region: form.region,
        town: form.town,
        landmark: form.landmark,
        amenities: form.amenities,
        description: form.description,
        images: form.images,
      });
      
      router.push("/?msg=property_submitted");
    } catch (error) {
      console.error('Error submitting property:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit property. Please try again.';
      
      setErrors({ submit: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#006D77] mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeaders />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#006D77]">
              Post a Property
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Share your property details to reach verified tenants.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Step</div>
            <div className="text-lg font-semibold text-[#006D77]">{step} / 3</div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-2 bg-[#83C5BE] rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Error Banner */}
        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
          {/* Step Panels */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-[#006D77]">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label>
                    <span className="text-sm text-gray-700">Title</span>
                    <input
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                        errors.title ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="e.g. 2-Bedroom Apartment near Market"
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                    {errors.title && (
                      <span className="text-xs text-red-500 mt-1">{errors.title}</span>
                    )}
                  </label>

                  <label>
                    <span className="text-sm text-gray-700">Property Type</span>
                    <select
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                        errors.propertyType ? "border-red-400" : "border-gray-200"
                      }`}
                      value={form.propertyType}
                      onChange={(e) =>
                        update("propertyType", e.target.value as PropertyType)
                      }
                    >
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    {errors.propertyType && (
                      <span className="text-xs text-red-500 mt-1">{errors.propertyType}</span>
                    )}
                  </label>

                  <label>
                    <span className="text-sm text-gray-700">Price (GHS)</span>
                    <input
                      type="number"
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                        errors.price ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="e.g. 800"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                    {errors.price && (
                      <span className="text-xs text-red-500 mt-1">{errors.price}</span>
                    )}
                  </label>

                  <label>
                    <span className="text-sm text-gray-700">
                      Payment Frequency
                    </span>
                    <select
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] border-gray-200"
                      value={form.paymentFrequency}
                      onChange={(e) =>
                        update("paymentFrequency", e.target.value as any)
                      }
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-[#006D77]">
                  Location Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label>
                    <span className="text-sm text-gray-700">Region</span>
                    <input
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                        errors.region ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="e.g. Central Region"
                      value={form.region}
                      onChange={(e) => update("region", e.target.value)}
                    />
                    {errors.region && (
                      <span className="text-xs text-red-500 mt-1">{errors.region}</span>
                    )}
                  </label>

                  <label>
                    <span className="text-sm text-gray-700">Town</span>
                    <input
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                        errors.town ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="e.g. Awutu Bawjiase"
                      value={form.town}
                      onChange={(e) => update("town", e.target.value)}
                    />
                    {errors.town && (
                      <span className="text-xs text-red-500 mt-1">{errors.town}</span>
                    )}
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm text-gray-700">
                      Landmark / Directions
                    </span>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] border-gray-200"
                      placeholder="e.g. Near Morning Star Temple"
                      value={form.landmark}
                      onChange={(e) => update("landmark", e.target.value)}
                    />
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-[#006D77]">
                  Amenities, Photos & Description
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {AMENITIES.map((a) => {
                    const active = form.amenities.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-full border transition ${
                          active
                            ? "bg-[#83C5BE] text-white"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>

                <label className="block mb-4">
                  <span className="text-sm text-gray-700">Description</span>
                  <textarea
                    className={`mt-1 w-full h-28 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#83C5BE] ${
                      errors.description ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Include details like water, electricity, nearby landmarks, etc."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                  {errors.description && (
                    <span className="text-xs text-red-500 mt-1">{errors.description}</span>
                  )}
                </label>

                {/* Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden border"
                    >
                      <img
                        src={src}
                        alt={`preview-${i}`}
                        className="h-28 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {form.images.length < MAX_IMAGES && (
                    <label className="flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer py-6 text-gray-500 hover:border-[#83C5BE]">
                      <input
                        ref={fileInputRef}
                        onChange={(e) => onPickImages(e.target.files)}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <ImageIcon className="h-6 w-6 mb-1" />
                      <span className="text-xs">Add Photos</span>
                    </label>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            {step > 1 && (
              <button
                onClick={back}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={next}
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-[#006D77] text-white font-medium hover:opacity-95"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitProperty}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-[#006D77] text-white font-medium hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Submitting..." : "Post Property"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}