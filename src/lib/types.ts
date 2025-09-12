
import type { LucideIcon } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  platform: string;
  rating: number;
  reviews: number;
  tags?: string[];
  dataAiHint?: string;
  stock?: number;
  createdAt?: Timestamp;
};

export type Category = {
  name: string;
  icon: LucideIcon;
  slug: string;
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  dataAiHint?: string;
};

export type UserRole = 'user' | 'manager' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};
