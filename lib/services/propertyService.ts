// lib/services/propertyService.ts
// Reusable property fetching functions

import { supabase } from "@/lib/supabase/client"

export interface Property {
  id: string
  title: string
  price: number
  location: string
  image: string
  views: number
  favorites: number
  isNew?: boolean
  // Add other fields from your database
  created_at?: string
  description?: string
  bedrooms?: number
  bathrooms?: number
  // etc.
}

// Helper function to get valid image URL
export const getValidImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  
  if (imageUrl.startsWith("http")) return imageUrl
  
  try {
    const publicUrl = supabase.storage
      .from("property-images")
      .getPublicUrl(imageUrl).data.publicUrl
    return publicUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  } catch {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  }
}

// Transform Supabase data to Property interface
export const transformProperty = (prop: any): Property => ({
  id: prop.id,
  title: prop.title || prop.name,
  price: prop.price || prop.rent,
  location: prop.location || prop.address,
  image: getValidImageUrl(prop.image_url || prop.image),
  views: prop.views || 0,
  favorites: prop.favorites || 0,
  isNew: prop.isNew,
  created_at: prop.created_at,
  description: prop.description,
  bedrooms: prop.bedrooms,
  bathrooms: prop.bathrooms,
})

// Fetch all properties
export const getProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map(transformProperty)
}

// Fetch recent properties (last N properties)
export async function getRecentProperties(limit: number = 4) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recent properties:', error);
    throw error;
  }
}

// Fetch featured properties
export async function getFeaturedProperties(limit: number = 3) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('available', true)
      .eq('is_featured', true) // Only get properties marked as featured
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
}

// Fetch random featured properties
export async function getRandomFeaturedProperties(limit: number = 3) {
  try {
    // First, get all available properties
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('available', true);

    if (error) throw error;

    // Randomly shuffle and take the first N
    const shuffled = [...(data || [])].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching random featured properties:', error);
    throw error;
  }
}

// Fetch featured properties by highest price
export async function getFeaturedPropertiesByPrice(limit: number = 3) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('available', true)
      .order('price', { ascending: false }) // Highest price first
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching featured properties by price:', error);
    throw error;
  }
}

// Mark or unmark a property as featured
export async function markPropertyAsFeatured(id: string, isFeatured: boolean = true) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating featured status:', error);
    throw error;
  }
}


// Search properties
export const searchProperties = async (
  query: string,
  filters?: {
    minPrice?: number
    maxPrice?: number
    location?: string
    bedrooms?: number
  }
): Promise<Property[]> => {
  let queryBuilder = supabase
    .from("properties")
    .select("*")

  // Add search query
  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`
    )
  }

  // Add filters
  if (filters?.minPrice) {
    queryBuilder = queryBuilder.gte("price", filters.minPrice)
  }
  if (filters?.maxPrice) {
    queryBuilder = queryBuilder.lte("price", filters.maxPrice)
  }
  if (filters?.location) {
    queryBuilder = queryBuilder.ilike("location", `%${filters.location}%`)
  }
  if (filters?.bedrooms) {
    queryBuilder = queryBuilder.eq("bedrooms", filters.bedrooms)
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map(transformProperty)
}


