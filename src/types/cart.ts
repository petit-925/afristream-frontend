import type { Product } from './product';

export interface CartItem {
  id: number; // product id
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  // Optional selected size for picture frame products
  selectedSize?: string | null;
}

export interface CartState {
  items: CartItem[];
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}
