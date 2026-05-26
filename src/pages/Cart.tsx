import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Cart: React.FC = () => {
  const { items, updateQty, removeItem, subtotal, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping / Delivery fee and estimated delivery (preview for Ghana)
  const hasLargeFrameInCart = items.some((i) => {
    if (!i.selectedSize) return false;
    const label = i.selectedSize.toUpperCase();
    if (['A2', 'A1', 'A0', '24X36'].includes(label.replace(/\s+/g, ''))) return true;
    const m = i.selectedSize.match(/(\d+)\s*x\s*(\d+)/i);
    if (!m) return false;
    const w = Number(m[1]);
    const h = Number(m[2]);
    if (!Number.isFinite(w) || !Number.isFinite(h)) return false;
    const area = w * h;
    return area >= 250;
  });

  const baseSmallDomestic = 50;
  const baseLargeDomestic = 80;
  const freeSmallThreshold = 1000;
  const freeLargeThreshold = 1500;

  const isLargeOrder = hasLargeFrameInCart;
  const freeThreshold = isLargeOrder ? freeLargeThreshold : freeSmallThreshold;
  const baseFee = isLargeOrder ? baseLargeDomestic : baseSmallDomestic;

  const isFreeShipping = total >= freeThreshold;
  const deliveryFee = isFreeShipping ? 0 : baseFee;
  const grandTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Cart</h1>

        {!items.length ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">Your cart is empty.</div>
            <Link 
              to="/shop" 
              className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex gap-4">
                  <img 
                    src={item.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg" 
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg mb-1">{item.name}</div>
                    {item.selectedSize && (
                      <div className="text-xs text-gray-400 mb-1">
                        Size: <span className="text-gray-200">{item.selectedSize}</span>
                      </div>
                    )}
                    <div className="text-primary text-xl font-bold mb-3">GH₵{item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-300">Quantity:</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQty(item.id, Number(e.target.value))}
                        className="w-20 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-white text-xl font-bold">GH₵{(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-red-400 hover:text-red-300 hover:underline text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-dark-800 border border-dark-700 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">GH₵{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Delivery</span>
                  {isFreeShipping ? (
                    <span className="font-medium text-green-400">Free</span>
                  ) : (
                    <span className="font-medium text-white">GH₵{deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                {isFreeShipping && (
                  <div className="rounded-md bg-green-900/30 border border-green-700 px-3 py-2 text-green-300 text-xs">
                    Free Shipping applied on orders over GHGH₵{freeShippingThreshold.toFixed(2)}
                </div>
                )}
                <div className="border-t border-dark-600 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Grand Total</span>
                    <span className="text-2xl font-bold text-white">GH₵{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(user ? '/checkout' : '/login')}
                className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
