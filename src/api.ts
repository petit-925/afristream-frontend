import { API_ENDPOINTS, apiRequest } from './config/api';
import type { UpdateProfilePayload, WishlistItem } from './types/user';

// Token storage key used by AuthContext and API requests
export const ACCESS_TOKEN_KEY = 'token';

export async function getUserOrders() {
  const url = `${API_ENDPOINTS.ORDERS.MY}`;
  return apiRequest(url, { method: 'GET' });
}

export async function getOrder(id: number) {
  const url = `${API_ENDPOINTS.ORDERS.MY}/${encodeURIComponent(String(id))}`;
  return apiRequest(url, { method: 'GET' });
}

export async function login(payload: { email: string; password: string }) {
  const url = `${API_ENDPOINTS.AUTH.LOGIN}`;
  // Expect backend to return { token | accessToken, user }
  const res = await apiRequest(url, { method: 'POST', body: JSON.stringify(payload) });
  const accessToken = (res.accessToken || res.token) as string;
  return { accessToken, user: res.user } as { accessToken: string; user: any };
}

export async function register(payload: { name: string; email: string; password: string }) {
  const url = `${API_ENDPOINTS.AUTH.REGISTER}`;
  const res = await apiRequest(url, { method: 'POST', body: JSON.stringify(payload) });
  const accessToken = (res.accessToken || res.token) as string;
  return { accessToken, user: res.user } as { accessToken: string; user: any };
}

export async function getMe() {
  const url = `${API_ENDPOINTS.AUTH.ME}`;
  return apiRequest(url, { method: 'GET' });
}

export async function updateProfile(profile: UpdateProfilePayload) {
  const url = `${API_ENDPOINTS.USERS.PROFILE}`;
  return apiRequest(url, { method: 'PUT', body: JSON.stringify(profile) });
}

export async function changePassword(payload: { currentPassword: string; newPassword: string; }) {
  const url = `${API_ENDPOINTS.AUTH.PROTECTED}/password`;
  return apiRequest(url, { method: 'POST', body: JSON.stringify(payload) });
}

export async function getProducts(params?: { category?: string; q?: string; page?: number; limit?: number; featured?: boolean }) {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.q) search.set('q', params.q);
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.limit != null) search.set('limit', String(params.limit));
  // 'featured' is accepted to satisfy callers; backend may ignore it.
  const url = `${API_ENDPOINTS.PRODUCTS.BASE}${search.toString() ? `?${search.toString()}` : ''}`;
  return apiRequest(url, { method: 'GET' });
}

export async function getProduct(id: number) {
  const url = `${API_ENDPOINTS.PRODUCTS.BASE}/${encodeURIComponent(String(id))}`;
  return apiRequest(url, { method: 'GET' });
}

export interface ProductReview {
  id: number;
  productId: number;
  userId?: number | null;
  rating: number;
  content?: string | null;
  size?: string | null;
  createdAt: string;
}

export async function getProductReviews(productId: number): Promise<{
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}> {
  const url = `${API_ENDPOINTS.PRODUCTS.BASE}/${encodeURIComponent(String(productId))}/reviews`;
  return apiRequest(url, { method: 'GET' });
}

export async function createProductReview(
  productId: number,
  payload: { rating: number; content?: string; size?: string }
): Promise<{
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}> {
  const url = `${API_ENDPOINTS.PRODUCTS.BASE}/${encodeURIComponent(String(productId))}/reviews`;
  return apiRequest(url, { method: 'POST', body: JSON.stringify(payload) });
}

export async function createOrder(payload: {
  items: { productId: number; quantity: number }[];
  shippingAddress: string;
  customerEmail?: string;
  customerPhone?: string;
  currency?: string;
  totalAmount?: number;
}) {
  const url = `${API_ENDPOINTS.ORDERS.BASE}`;
  return apiRequest(url, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateOrder(id: number, payload: Partial<{ status: string; paymentReference: string; paymentMethod: string }>) {
  const url = `${API_ENDPOINTS.ORDERS.BASE}/${encodeURIComponent(String(id))}`;
  return apiRequest(url, { method: 'PUT', body: JSON.stringify(payload) });
}

export interface WishlistList {
  name: string;
  shareToken?: string | null;
  items: WishlistItem[];
}

const mapWishlistItem = (item: any): WishlistItem => ({
  id: Number(item.id),
  productId: Number(item.product_id ?? item.productId ?? item.product?.id ?? 0),
  userId: Number(item.user_id ?? item.userId ?? 0),
  createdAt: item.created_at ?? item.createdAt,
  listName: item.list_name ?? 'Default',
  shareToken: item.share_token ?? null,
  product: {
    id: Number(item.product_id ?? item.productId ?? item.product?.id ?? 0),
    name: item.product_name ?? item.product?.name ?? 'Unknown Product',
    price: Number(item.price ?? item.product?.price ?? 0),
    imageUrl: item.image_url ?? item.product?.imageUrl ?? item.product?.image_url ?? '',
    description: item.description ?? item.product?.description,
  },
});

export async function getWishlist(): Promise<WishlistList[]> {
  const data = await apiRequest(API_ENDPOINTS.WISHLIST.BASE, { method: 'GET' });
  if (!data || typeof data !== 'object' || !data.lists) return [];
  const listsObj = data.lists as Record<string, any>;
  return Object.values(listsObj).map((l: any) => ({
    name: l.name,
    shareToken: l.shareToken ?? l.share_token ?? null,
    items: Array.isArray(l.items) ? l.items.map(mapWishlistItem) : [],
  }));
}

export async function addWishlistItem(productId: number, listName?: string): Promise<WishlistItem> {
  const data = await apiRequest(API_ENDPOINTS.WISHLIST.BASE, {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, listName }),
  });
  return mapWishlistItem(data);
}

export async function removeWishlistItem(wishlistId: number): Promise<void> {
  await apiRequest(`${API_ENDPOINTS.WISHLIST.BASE}/${encodeURIComponent(String(wishlistId))}`, {
    method: 'DELETE',
  });
}

export async function clearWishlist(): Promise<void> {
  await apiRequest(API_ENDPOINTS.WISHLIST.BASE, { method: 'DELETE' });
}

export async function renameWishlistList(oldName: string, newName: string): Promise<void> {
  await apiRequest(API_ENDPOINTS.WISHLIST.BASE + '/list', {
    method: 'PATCH',
    body: JSON.stringify({ oldName, newName }),
  });
}

export async function toggleWishlistShare(listName: string, enable: boolean): Promise<string | null> {
  const data = await apiRequest(API_ENDPOINTS.WISHLIST.BASE + '/list/share', {
    method: 'POST',
    body: JSON.stringify({ listName, enable }),
  });
  return data?.shareToken ?? null;
}

export async function getSharedWishlist(token: string): Promise<{ name: string; items: WishlistItem[] }> {
  const data = await apiRequest(`${API_ENDPOINTS.WISHLIST.BASE}/shared/${encodeURIComponent(token)}`, {
    method: 'GET',
  });
  return {
    name: data.name,
    items: Array.isArray(data.items) ? data.items.map(mapWishlistItem) : [],
  };
}

