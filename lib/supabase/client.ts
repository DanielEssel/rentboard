""

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
          return cookie?.split('=')[1]
        },
        set(name: string, value: string, options: any) {
          let cookieString = `${name}=${value}; path=/;`
          
          if (options?.maxAge) {
            cookieString += ` max-age=${options.maxAge};`
          }
          
          // Important for cross-domain auth
          if (options?.sameSite) {
            cookieString += ` SameSite=${options.sameSite};`
          }
          
          document.cookie = cookieString
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; path=/; max-age=0;`
        },
      },
    }
  )
}

export const supabase = createSupabaseBrowserClient()

// Types
export type Property = {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  price: number;
  payment_frequency: 'monthly' | 'yearly' | 'negotiable';
  available: boolean;
  region: string;
  town: string;
  landmark: string | null;
  amenities: string[];
  description: string;
  created_at: string;
  updated_at: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
};