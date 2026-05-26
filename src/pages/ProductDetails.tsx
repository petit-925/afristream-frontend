import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getProducts, getProductReviews, createProductReview, type ProductReview } from '../api';
import { UPLOADS_BASE_URL } from '../config/api';
import { Loader2, ShoppingCart, Facebook, Twitter, Linkedin, MessageCircle, Search, ArrowRight, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { addWishlistItem, getWishlist, removeWishlistItem } from '../api';
import Toast from '../components/ui/Toast';

interface FrameOption {
  size: string;
  price: number;
  stock?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string | null;
  stock?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  longDescription?: string;
  features?: string[];
  gallery?: string[];
  frameOptions?: FrameOption[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Fetch product details
    getProduct(Number(id))
      .then((data: Product) => {
        if (data && data.id) {
          setProduct(data);
          setActiveMediaIndex(0);
          
          // Fetch related products (same category, excluding current product)
          return getProducts({ 
            category: data.category, 
            limit: 4 
          });
        } else {
          setError('Product not found.');
          return Promise.resolve([]);
        }
      })
      .then((relatedData: any) => {
        if (Array.isArray(relatedData)) {
          // Filter out current product and limit to 4
          const filtered = relatedData
            .filter((p: Product) => p.id !== Number(id))
            .slice(0, 4);
          setRelatedProducts(filtered);
        } else if (relatedData?.items) {
          const filtered = relatedData.items
            .filter((p: Product) => p.id !== Number(id))
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      })
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Load reviews when product is loaded
  useEffect(() => {
    if (!product?.id) return;
    (async () => {
      try {
        const data = await getProductReviews(product.id);
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setReviewCount(data.reviewCount || 0);
      } catch {
        // Keep reviews empty on failure
        setReviews([]);
        setAverageRating(0);
        setReviewCount(0);
      }
    })();
  }, [product?.id]);

  // Initialize selected size when product with frameOptions loads
  useEffect(() => {
    if (product?.category === 'picture-frames' && Array.isArray(product.frameOptions) && product.frameOptions.length > 0) {
      setSelectedSize((prev) => prev ?? product.frameOptions![0].size);
    } else {
      setSelectedSize(null);
    }
  }, [product?.id, product?.category, product?.frameOptions]);

  useEffect(() => {
    let isMounted = true;
    async function syncWishlistState(productId: number) {
      try {
        setWishlistLoading(true);
        const items = await getWishlist();
        if (!isMounted) return;
        const found = items.find((item) => item.productId === productId);
        setWishlistItemId(found ? found.id : null);
      } catch (wishlistError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load wishlist', wishlistError);
        }
      } finally {
        if (isMounted) {
          setWishlistLoading(false);
        }
      }
    }

    if (user && product?.id) {
      syncWishlistState(product.id);
    } else {
      setWishlistItemId(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user, product?.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // For picture frame products, require a size when options exist
    if (product.category === 'picture-frames' && Array.isArray(product.frameOptions) && product.frameOptions.length > 0) {
      if (!selectedSize) {
        showError('Select a size', 'Please choose a frame size before adding to cart.');
        return;
      }
      const match = product.frameOptions.find(
        (opt) => opt.size.toLowerCase() === selectedSize.toLowerCase()
      );
      const unitPrice = match?.price ?? product.price;
      addItem(
        { id: product.id, name: product.name, price: unitPrice, imageUrl: product.imageUrl },
        quantity,
        { selectedSize }
      );
      showSuccess('Added to cart', `${product.name} (${selectedSize}) has been added to your cart.`);
      return;
    }

    // Default behaviour for non-frame products
    addItem(
      { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl },
      quantity
    );
    showSuccess('Added to cart', `${product.name} has been added to your cart.`);
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (!user) {
      showInfo('Login required', 'Please sign in to manage your wishlist.');
      return;
    }

    try {
      setWishlistLoading(true);
      if (wishlistItemId) {
        await removeWishlistItem(wishlistItemId);
        setWishlistItemId(null);
        showSuccess('Removed from wishlist', `${product.name} has been removed from your wishlist.`);
      } else {
        const item = await addWishlistItem(product.id);
        setWishlistItemId(item.id);
        showSuccess('Wishlist updated', `${product.name} has been added to your wishlist.`);
      }
    } catch (wishlistError: any) {
      const message = wishlistError?.message || 'Failed to update wishlist.';
      showError('Wishlist error', message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  const mediaList: string[] = [
    // Primary imageUrl
    ...(product.imageUrl ? [product.imageUrl] : []),
    // Fallback to legacy `image` field
    ...(((product as any).image) ? [(product as any).image] : []),
    // Gallery items
    ...(Array.isArray((product as any).gallery) ? (product as any).gallery : [])
  ];
  const toAbsolute = (url: string): string => {
    if (!url) return '';
    // Normalize Windows backslashes to URL slashes
    url = url.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('//')) return url;
    let clean = url.replace(/^\//, '');
    if (!clean.startsWith('uploads/')) clean = `uploads/${clean}`;
    return `${UPLOADS_BASE_URL}/${encodeURI(clean.replace(/^uploads\//, ''))}`;
  };
  const isValidMedia = (url: string): boolean => {
    if (!url) return false;
    const u = url.toLowerCase();
    return u.startsWith('http') || u.startsWith('data:') || u.startsWith('//');
  };
  const normalizedList = mediaList.map(toAbsolute).filter(isValidMedia);
  if (normalizedList.length === 0 && product.imageUrl) normalizedList.push(toAbsolute(product.imageUrl));
  // Ensure unique media entries to avoid duplicates when imageUrl also exists in gallery/legacy fields
  const uniqueList = Array.from(new Set(normalizedList));
  // Log final media list for debugging
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[ProductDetails] Final media URLs:', normalizedList);
  }
  const activeMedia = uniqueList[activeMediaIndex] || uniqueList[0] || '';

  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23222222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23aaaaaa" font-size="14">Image unavailable</text></svg>';

  const isPictureFrame = product.category === 'picture-frames' && Array.isArray(product.frameOptions) && product.frameOptions.length > 0;
  const activeFrameOption =
    isPictureFrame && selectedSize
      ? product.frameOptions!.find(
          (opt) => opt.size.toLowerCase() === selectedSize.toLowerCase()
        )
      : undefined;
  const displayPrice = activeFrameOption?.price ?? product.price;
  const displayStock =
    activeFrameOption?.stock != null ? activeFrameOption.stock : product.stock;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!user) {
      showInfo('Login required', 'Please sign in to write a review.');
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      showError('Invalid rating', 'Please select a rating between 1 and 5 stars.');
      return;
    }
    try {
      const payload: { rating: number; content?: string; size?: string } = {
        rating: reviewRating,
      };
      if (reviewContent.trim().length > 0) {
        payload.content = reviewContent.trim();
      }
      if (isPictureFrame && selectedSize) {
        payload.size = selectedSize;
      }
      const data = await createProductReview(product.id, payload);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setReviewCount(data.reviewCount || 0);
      setReviewContent('');
      showSuccess('Review submitted', 'Thank you for reviewing this product.');
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit review.';
      showError('Review error', msg);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Spacing for Header Separation */}
      <div className="pt-24"></div>
      
      {/* Main Product Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div>
              {/* Main Media */}
              <div className="relative mb-6">
                <div className=" aspect-square bg-dark-00 rounded-lg overflow-hidden">
                  {activeMedia.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                    <video src={activeMedia} controls className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={activeMedia || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholder; }}
                    />
                  )}
                </div>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Search size={20} className="text-white" />
                </button>
              </div>
              {/* Thumbnails */}
                {uniqueList.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {uniqueList.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveMediaIndex(index)}
                        className={`
                          relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                          border-2 ${index === activeMediaIndex ? 'border-primary shadow-lg shadow-primary/40' : 'border-dark-700'}
                          hover:scale-105 hover:shadow-md hover:shadow-black/40
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                        {media.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                          <video
                            src={media}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={media}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholder; }}
                          />
                        )}
                      </button>
                    ))}
                  </div>  
              )}
            </div>

        {/* Product Info */}
        <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 capitalize">{product.name}</h1>
              {/* Rating summary */}
              <div className="flex items-center gap-2 mb-6">
                {reviewCount > 0 ? (
                  <>
                    <span className="text-yellow-400">
                      {'★'.repeat(Math.round(averageRating))}{' '}
                      <span className="text-gray-600">
                        {'★'.repeat(Math.max(0, 5 - Math.round(averageRating)))}
                      </span>
                    </span>
                    <span className="text-sm text-gray-300">
                      {averageRating.toFixed(1)} / 5 · {reviewCount} review{reviewCount === 1 ? '' : 's'}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">No ratings yet</span>
                )}
              </div>
              
              {/* Price with discount */}
              <div className="mb-4 flex items-center gap-4">
                <span className="text-5xl font-bold text-white">
                  GH₵
                  {displayPrice.toLocaleString('en-GH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {typeof product.originalPrice === 'number' && product.originalPrice > displayPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    GH₵
                    {Number(product.originalPrice).toLocaleString('en-GH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>

              {/* Frame size selector (only for picture frames with sizes) */}
              {isPictureFrame && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frame Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.frameOptions!.map((opt) => {
                      const isSelected =
                        selectedSize &&
                        opt.size.toLowerCase() === selectedSize.toLowerCase();
                      const outOfStock = opt.stock != null && opt.stock <= 0;
                      return (
                        <button
                          key={opt.size}
                          type="button"
                          disabled={outOfStock}
                          onClick={() => setSelectedSize(opt.size)}
                          className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                            isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'border-dark-600 text-gray-200 hover:bg-dark-700'
                          } ${outOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {opt.size}
                          {outOfStock && <span className="ml-1 text-xs text-red-300">(Out)</span>}
                        </button>
                      );
                    })}
                  </div>
                  {displayStock != null && (
                    <p className="mt-2 text-xs text-gray-400">
                      Available stock for selected size:{' '}
                      <span className="font-semibold text-gray-200">
                        {displayStock > 0 ? displayStock : 'Out of stock'}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center mb-8">
                <label className="text-gray-300 mr-4">Quantity:</label>
                <div className="flex items-center border border-dark-600 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 h-10 text-center bg-transparent text-white border-none focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={displayStock === 0}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  ADD TO CART
                </Button>
                <Button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={`flex-1 px-8 py-4 text-lg font-semibold rounded-lg transition-colors border ${wishlistItemId ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700' : 'bg-transparent border-dark-600 text-white hover:bg-dark-700'}`}
                >
                  <Heart
                    size={20}
                    className="mr-2"
                    fill={wishlistItemId ? 'currentColor' : 'none'}
                  />
                  {wishlistItemId ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                </Button>
              </div>

              {/* Category and Tags */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-400 w-20 ">Category:</span>
                  <span className="text-white capitalize">{product.category || 'Application'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-20">Tags:</span>
                  <div className="flex space-x-2">
                    {['Automation', 'Software'].map((tag, index) => (
                      <span key={index} className="bg-dark-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {tag}
            </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-dark-600 mb-12">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'text-white border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              DESCRIPTION
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-white border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              REVIEWS ({reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'description' && (
              <div className="space-y-8">
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    {product.description || product.longDescription || 'No description available for this product.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Scalability</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our solutions are built with scalability in mind, ensuring that your business can grow without limitations. We implement robust architectures that can handle increased load and user demands as your business expands.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Security</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Security is our top priority. We implement industry-standard security measures to protect your data and ensure compliance with relevant regulations. Our solutions include encryption, secure authentication, and regular security updates.
                  </p>
          </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Integration</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Seamless integration with your existing systems is crucial for business efficiency. Our solutions are designed to work with popular platforms and can be customized to integrate with your specific business tools and workflows.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Automation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Automate repetitive tasks and streamline your business processes. Our automation solutions help reduce manual work, minimize errors, and increase productivity, allowing your team to focus on more strategic activities.
                  </p>
                </div>

                {/* Social Sharing */}
                <div className="pt-8 border-t border-dark-600">
                  <h4 className="text-lg font-semibold text-white mb-4">Share this product:</h4>
                  <div className="flex space-x-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <Facebook size={16} className="mr-2" />
                      Facebook
                    </button>
                    <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <Twitter size={16} className="mr-2" />
                      Twitter
                    </button>
                    <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <Linkedin size={16} className="mr-2" />
                      LinkedIn
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                      <MessageCircle size={16} className="mr-2" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Summary */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Customer Reviews</h3>
                    {reviewCount > 0 ? (
                      <p className="text-gray-300">
                        <span className="text-yellow-400 mr-1">
                          {'★'.repeat(Math.round(averageRating))}
                        </span>
                        <span className="text-sm text-gray-300">
                          {averageRating.toFixed(1)} out of 5 · {reviewCount} review
                          {reviewCount === 1 ? '' : 's'}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this product.</p>
                    )}
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews.length === 0 && (
                    <div className="text-gray-400 text-sm">
                      No reviews have been posted for this product yet.
                    </div>
                  )}
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-dark-900/60 border border-dark-700 rounded-lg p-4 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-yellow-400 text-sm">
                          {'★'.repeat(r.rating)}
                          <span className="text-gray-600">
                            {'★'.repeat(Math.max(0, 5 - r.rating))}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString()}
                          {r.size && ` · Size: ${r.size}`}
                        </span>
                      </div>
                      {r.content && (
                        <p className="text-sm text-gray-200 mt-1 whitespace-pre-line">
                          {r.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Review form */}
                <div className="border-t border-dark-700 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Write a Review
                  </h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none"
                          >
                            <span
                              className={
                                star <= reviewRating ? 'text-yellow-400 text-xl' : 'text-gray-600 text-xl'
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    {isPictureFrame && (
                      <p className="text-xs text-gray-400">
                        Tip: your review will be linked to the currently selected size ({selectedSize || 'none selected'}).
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Related products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-dark-800 rounded-lg overflow-hidden group hover:bg-dark-700 transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{relatedProduct.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-4">GH₵{relatedProduct.price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <Button 
                      onClick={() => addItem(relatedProduct, 1)}
                      fullWidth 
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">
                No related products found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-8xl text-white/20 mb-8">"</div>
            <p className="text-white text-xl leading-relaxed mb-8">
              They have a team that is not only extremely knowledgeable but also very professional and quick to respond to any inquiries. They have proven to be an outstanding digital partner for us to collaborate with.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full mr-4"></div>
              <div className="text-left">
                <div className="text-white font-semibold text-lg">Emma Smith</div>
                <div className="text-gray-400">Grill Industries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-dark-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30 0 60 30 30 60 0 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
               Utilize our powerful digital <span className="text-primary">solutions to expand your company.</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                We consistently exceed our clients' expectations by providing high quality digital solutions. Get in touch with us to get started!
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">+233 (243) 495-616</div>
                  <div className="text-gray-400 text-sm">Talk to an expert</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">info@afristreamgh.com</div>
                  <div className="text-gray-400 text-sm">Email Us</div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center">
                GET STARTED <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={removeToast}
        />
      ))}

    </div>
  );
};

export default ProductDetails;
