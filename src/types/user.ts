export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  profileCompletion?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: number;
  fullName: string;
  street: string;
  city: string;
  region: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  listName?: string;
  shareToken?: string | null;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
  };
  userId: number;
  createdAt?: string;
}

export interface UserSession {
  id: string;
  deviceType: string;
  browser: string;
  lastLogin: string;
  ipAddress: string;
  isCurrent: boolean;
}

export interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
