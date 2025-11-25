import { supabase } from './supabase/client';

// TYPES
export type Property = {
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
  views?: number
favorites?: number
isFavorited?: boolean

};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
};


// POST - Create a new property
export async function createProperty(data: {
  title: string;
  property_type: string;
  price: number;
  payment_frequency: 'monthly' | 'yearly' | 'negotiable';
  available: boolean;
  region: string;
  town: string;
  landmark?: string;
  amenities: string[];
  description: string;
  images: File[];
}) {
  try {
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 2. Insert property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        user_id: user.id,
        title: data.title,
        property_type: data.property_type,
        price: data.price,
        payment_frequency: data.payment_frequency,
        available: data.available,
        region: data.region,
        town: data.town,
        landmark: data.landmark || null,
        amenities: data.amenities,
        description: data.description,
      })
      .select()
      .single();

    if (propertyError) throw propertyError;

    // 3. Upload images
    const imageUrls: string[] = [];
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const fileName = `${user.id}/${property.id}/${Date.now()}-${i}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);

      // Insert image record
      await supabase.from('property_images').insert({
        property_id: property.id,
        image_url: publicUrl,
        display_order: i,
      });
    }

    return { property, imageUrls };
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

// GET - Fetch all properties
export async function getProperties(filters?: {
  region?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
}) {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters?.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte('price', filters.max_price);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

// GET - Fetch single property
export async function getPropertyById(id: string) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

// PUT/PATCH - Update property
export async function updateProperty(id: string, updates: Partial<{
  title: string;
  property_type: string;
  price: number;
  payment_frequency: 'monthly' | 'yearly' | 'negotiable';
  available: boolean;
  region: string;
  town: string;
  landmark: string;
  amenities: string[];
  description: string;
}>) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

// DELETE - Delete property
export async function deleteProperty(id: string) {
  try {
    // Delete images from storage
    const { data: images } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('property_id', id);

    if (images) {
      for (const img of images) {
        const path = img.image_url.split('/property-images/')[1];
        if (path) {
          await supabase.storage.from('property-images').remove([path]);
        }
      }
    }

    // Delete property (cascades to images table)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

// GET - Fetch user's properties
export async function getUserProperties() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user properties:', error);
    throw error;
  }
}