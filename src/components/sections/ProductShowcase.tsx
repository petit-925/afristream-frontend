import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api';
import { API_BASE_URL, UPLOADS_BASE_URL } from '../../config/api';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  category?: string;
  price?: number;
}

const MAX_VISIBLE_PRODUCTS = 4;

const shuffleAndPick = (source: Product[], count: number) => {
  if (source.length === 0) return [];
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
};

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getProducts({ featured: true, limit: 20 });
        const items = Array.isArray((result as any).items)
          ? (result as any).items
          : Array.isArray(result)
          ? result
          : [];
        const absolutize = (url?: string) => {
          if (!url) return '';
          url = url.replace(/\\/g, '/');
          if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
          let clean = url.replace(/^\//, '');
          if (!clean.startsWith('uploads/')) clean = `uploads/${clean}`;
          return `${UPLOADS_BASE_URL}/${clean.replace(/^uploads\//, '')}`;
        };

        const mapped: Product[] = items.map((p: any) => ({
          id: Number(p.id),
          name: p.name || 'Product',
          imageUrl:
            absolutize(p.image || p.imageUrl || p.featuredImage) ||
            'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
          category: p.category || 'Uncategorized',
          price: p.price || 0,
        }));
        setProducts(mapped);
        setVisibleProducts(shuffleAndPick(mapped, MAX_VISIBLE_PRODUCTS));
      } catch {
        setProducts([]);
        setVisibleProducts([]);
      }
    })();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('product-showcase');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    if (products.length <= MAX_VISIBLE_PRODUCTS) {
      setVisibleProducts(products);
      return;
    }

    const interval = setInterval(() => {
      setVisibleProducts(shuffleAndPick(products, MAX_VISIBLE_PRODUCTS));
    }, 10000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <section id="product-showcase" className="py-20 bg-dark-800 relative">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our premium collection of digital solutions, software products, and creative services
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-700 bg-dark-700 hover:bg-dark-600 shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Layer */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {/* Red bottom fade gradient (only on hover) */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-700/60 to-transparent"></div>
              </div>

              {/* Text + Button (aligned left) */}
              <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                <h3 className="text-2xl font-semibold text-white mb-2 transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  {product.name}
                </h3>
                <div className="text-lg text-gray-200 font-semibold mb-3 transform transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100">
                  GH₵
                  {(product.price || 0).toLocaleString('en-GH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="inline-flex items-center text-red-400 text-base font-medium opacity-80 transform transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 hover:text-red-300"
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Red outline + glow on hover */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No featured products available at the moment.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            View All Products
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
