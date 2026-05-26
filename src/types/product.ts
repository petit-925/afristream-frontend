export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style' | 'material' | 'custom';
  value: string;
  priceModifier?: number;
  stock?: number;
  sku?: string;
  image?: string;
  thumbnail?: string;
  isDefault?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  thumbnail: string;
  alt?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductSwatch {
  id: string;
  variantId: string;
  color?: string;
  image?: string;
  thumbnail?: string;
  name: string;
  isAvailable?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  imageUrl?: string | null;
  thumbnailUrl?: string;
  stock?: number;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  categoryId?: number;
  tags?: string[];
  longDescription?: string;
  features?: string[];
  // Enhanced media support
  gallery?: ProductImage[];
  // Frame sizes (only for picture frame products)
  frameOptions?: Array<{
    size: string;
    price: number;
    stock?: number;
  }>;
  // Variants and swatches
  variants?: ProductVariant[];
  swatches?: ProductSwatch[];
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  // Analytics
  viewCount?: number;
  downloadCount?: number;
  rating?: number;
  reviewCount?: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  featured?: boolean;
  category?: string;
}

export interface PaginatedProducts {
  items: Product[];
  page: number;
  limit: number;
  total: number;
}
