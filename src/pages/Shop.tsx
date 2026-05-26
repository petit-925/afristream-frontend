import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import Testimonials from '../components/sections/Testimonials';
import { getProducts } from '../api';
import { API_BASE_URL, UPLOADS_BASE_URL } from '../config/api';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  sale?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [toast, setToast] = useState<{ visible: boolean; text: string; productId: number | null }>({ visible: false, text: '', productId: null });

  // Updated categories as requested
  const predefinedCategories: Category[] = [
    { id: 'all', name: 'All Products', count: 0 },
    { id: 'software', name: 'Software', count: 0 },
    { id: 'apps', name: 'Apps', count: 0 },
    { id: 'web-design', name: 'Web Design', count: 0 },
    { id: 'logos', name: 'Logos', count: 0 },
    { id: 'branding', name: 'Branding', count: 0 },
    { id: 'picture-frames', name: 'Picture Frames', count: 0 },
    { id: 'art-paints', name: 'Art & Paints', count: 0 }
  ];

  useEffect(() => {
    getProducts({ q: '', page: 1 })
      .then((data: any[] | { items: any[] }) => {
        // Accept either array or { items }
        const items: any[] = Array.isArray(data) ? data : (Array.isArray((data as any)?.items) ? (data as any).items : []);
        setProducts(items as unknown as Product[]);
        
        // Update category counts
        const updatedCategories = predefinedCategories.map(cat => {
          if (cat.id === 'all') {
            return { ...cat, count: items.length };
          }
          const count = items.filter((product: any) => {
            const productCategory = (product.category || '').toLowerCase();
            return productCategory.includes(cat.id.toLowerCase()) || 
                   productCategory.includes(cat.name.toLowerCase());
          }).length;
          return { ...cat, count };
        });
        setCategories(updatedCategories);
      })
      .catch(() => {
        setProducts([]);
        setCategories(predefinedCategories);
        setError('Failed to load products.');
      });
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(product => {
    if (selectedCategory === 'all') {
      return product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Map product categories to predefined categories
    const productCategory = (product.category || '').toLowerCase();
    let mappedCategory = '';
    
    if (productCategory.includes('template') || productCategory.includes('web-design')) {
      mappedCategory = 'web-design';
    } else if (productCategory.includes('logo') || productCategory.includes('brand')) {
      mappedCategory = 'logos';
    } else if (productCategory.includes('branding')) {
      mappedCategory = 'branding';
    } else if (productCategory.includes('software') || productCategory.includes('app')) {
      mappedCategory = 'software';
    } else if (productCategory.includes('picture') || productCategory.includes('frame')) {
      mappedCategory = 'picture-frames';
    } else if (productCategory.includes('art') || productCategory.includes('paint')) {
      mappedCategory = 'art-paints';
    } else {
      mappedCategory = productCategory;
    }
    
    const matchesCategory = mappedCategory === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const absolutize = (url?: string | null) => {
    if (!url) return '';
    // Normalize Windows backslashes to URL slashes
    url = url.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    let clean = url.replace(/^\//, '');
    if (!clean.startsWith('uploads/')) clean = `uploads/${clean}`;
    return `${UPLOADS_BASE_URL}/${clean.replace(/^uploads\//, '')}`;
  };
  const featuredProducts = safeProducts
    .map((p: any) => ({
      ...p,
      image: absolutize(p.image || p.imageUrl),
      imageUrl: absolutize(p.imageUrl || p.image),
      gallery: Array.isArray(p.gallery) ? p.gallery.map((g: string) => absolutize(g)) : [],
    }))
    .filter((product: any) => product.featured);

  return (
    <>
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/80 to-dark-900"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our premium collection of digital solutions, software products, and creative services
          </p>
        </div>
      </section>

      {/* Main Shop Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Search */}
              <div className="bg-dark-800 p-6 rounded-lg mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              {/* Featured Products */}
              <div className="bg-dark-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4 text-primary">Featured Products</h3>
                <div className="space-y-4">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="flex items-center space-x-3 hover:opacity-80 transition"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{product.name}</h4>
                        <p className="text-xs text-gray-400">View Details</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Product Categories */}
              <div className="bg-dark-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4 text-primary">Product Categories</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-xs">({category.count})</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'all'
                    ? 'All Products'
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Showing {filteredProducts.length} products</span>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {error && <div className="col-span-full text-red-500 text-center mb-4">{error}</div>}
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-dark-800 rounded-lg overflow-hidden group hover:bg-dark-700 transition-all duration-300 relative"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative">
                        <img
                          src={absolutize(((product as any).gallery && (product as any).gallery[0]) || (product as any).image || (product as any).imageUrl)}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.sale && (
                          <div className="absolute top-4 left-4 bg-primary px-2 py-1 rounded text-xs font-bold">
                            SALE
                          </div>
                        )}
                        {product.featured && (
                          <div className="absolute top-4 right-4 bg-yellow-500 px-2 py-1 rounded text-xs font-bold text-black">
                            FEATURED
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block bg-dark-800/80 text-white text-xs px-2 py-1 rounded font-medium">
                            {product.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400 ml-2">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-white">
                            GH₵{Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              GH₵{Number(product.originalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button fullWidth className="group-hover:bg-primary-dark" onClick={() => {
                        addItem(
                          { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl as any },
                          1
                        );
                        setToast({ visible: true, text: `${product.name} added to cart`, productId: product.id });
                        setTimeout(() => setToast({ visible: false, text: '', productId: null }), 2000);
                      }}>
                        <ShoppingCart className="mr-2" size={16} />
                        Add to Cart
                      </Button>
                      {toast.visible && toast.productId === product.id && (
                        <div className="absolute bottom-3 left-6 z-20 pointer-events-none">
                          <div className="bg-dark-800 border border-dark-600 text-white px-3 py-2 rounded shadow">
                            {toast.text}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
    </>
  );
};

export default Shop;
