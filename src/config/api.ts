// API Configuration
// IMPORTANT: Set VITE_API_URL in your .env file to match your backend address (e.g., http://localhost:5000/api/v1)
export const API_BASE_URL = import.meta.env.VITE_API_URL as string;
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';
export const API_FALLBACK_URL = import.meta.env.VITE_API_URL_FALLBACK || '';
export const API_HOST = API_BASE_URL.replace(/\/api(\/.*)?$/,'');

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROTECTED: `${API_BASE_URL}/auth/protected`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    PROFILE: `${API_BASE_URL}/users/profile`,
  },
  // Products
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
  },
  // Orders
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    MY: `${API_BASE_URL}/orders/my-orders`,
  },
  // Payments
  PAYMENTS: {
    VERIFY: `${API_BASE_URL}/payments/verify`,
  },
  // Portfolio
  PORTFOLIO: {
    BASE: `${API_BASE_URL}/portfolio`,
  },
  // Blog
  BLOG: {
    BASE: `${API_BASE_URL}/blog`,
  },
  // Testimonials
  TESTIMONIALS: {
    BASE: `${API_BASE_URL}/testimonials`,
  },
  // Wishlist
  WISHLIST: {
    BASE: `${API_BASE_URL}/wishlist`,
  },
};

// API Helper Functions
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const tryFetch = async (url: string) => {
    const res = await fetch(url, config);
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      const errorText = `HTTP error! status: ${res.status}`;
      throw new Error(errorText);
    }
    return res.json();
  };

  try {
    return await tryFetch(endpoint);
  } catch (err) {
    // Fallback to secondary API URL if provided
    if (API_FALLBACK_URL && endpoint.startsWith(API_BASE_URL)) {
      const alt = endpoint.replace(API_BASE_URL, API_FALLBACK_URL);
      try {
        return await tryFetch(alt);
      } catch (err2) {
        console.error('❌ API request failed (fallback):', err2);
        throw err2;
      }
    }
    console.error('❌ API request failed:', err);
    throw err;
  }
};

export default API_ENDPOINTS; 