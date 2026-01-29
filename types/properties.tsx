type Property = {
  id: string;
  user_id: string;
  title: string;
  price: number;
  images: string[];
  amenities: string[];
  available: boolean;
  property_type: string;
  payment_frequency: string;
  town: string;
  region: string;
  landmark?: string;
  description: string;
  created_at: string;
  listedBy?: {
    full_name: string;
    phone?: string;
    email?: string;
  };
  views?: number; 
  favorites?: number; 
  message_count?: number;
};

type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string | null;
  email?: string | null;
  created_at?: string;
};
