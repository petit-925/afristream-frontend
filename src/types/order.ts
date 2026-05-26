import type { Product } from './product';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethod = 'paystack' | 'manual' | 'bank_transfer';

export interface OrderItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  currency?: string | null;
  paymentMethod?: PaymentMethod | null;
  paymentReference?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: string;
  customerEmail?: string;
  customerPhone?: string;
  currency?: string;
  totalAmount?: number;
}

export interface CheckoutPayload {
  orderId: number;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  paymentReference?: string;
  paymentMethod?: PaymentMethod;
}
