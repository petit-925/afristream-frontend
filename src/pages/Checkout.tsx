import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { createOrder, updateOrder } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import paystackService from '../services/paystackService';
import momoService from '../services/momoService';

const Checkout: React.FC = () => {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'manual' | 'momo'>('paystack');

  // Shipping & Estimated Delivery helpers
  const hasLargeFrameInCart = items.some((i) => {
    if (!i.selectedSize) return false;
    const label = i.selectedSize.toUpperCase();
    // Treat some common labels as "large"
    if (['A2', 'A1', 'A0', '24X36'].includes(label.replace(/\s+/g, ''))) return true;
    // Parse numeric sizes like "16x20"
    const m = i.selectedSize.match(/(\d+)\s*x\s*(\d+)/i);
    if (!m) return false;
    const w = Number(m[1]);
    const h = Number(m[2]);
    if (!Number.isFinite(w) || !Number.isFinite(h)) return false;
    const area = w * h;
    // Anything significantly larger than 8x10 is considered large
    return area >= 250; // e.g. 16x20 = 320
  });

  const isDomestic = country === 'Ghana';

  // More flexible shipping rules
  const baseSmallDomestic = 50;
  const baseSmallInternational = 100;
  const baseLargeDomestic = 80;
  const baseLargeInternational = 150;

  const freeSmallThreshold = 1000;
  const freeLargeThreshold = 1500;

  const isLargeOrder = hasLargeFrameInCart;
  const freeThreshold = isLargeOrder ? freeLargeThreshold : freeSmallThreshold;
  const baseFee = isLargeOrder
    ? (isDomestic ? baseLargeDomestic : baseLargeInternational)
    : (isDomestic ? baseSmallDomestic : baseSmallInternational);

  const isFreeShipping = total >= freeThreshold;
  const deliveryFee = isFreeShipping ? 0 : baseFee;
  const grandTotal = total + deliveryFee;

  // Estimated delivery window based on location & product type
  const estimate = (() => {
    if (isDomestic) {
      return isLargeOrder ? { minDays: 3, maxDays: 6 } : { minDays: 2, maxDays: 4 };
    }
    return isLargeOrder ? { minDays: 7, maxDays: 14 } : { minDays: 5, maxDays: 10 };
  })();

  const formatDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const estimatedRangeLabel = `${estimate.minDays}–${estimate.maxDays} business days (${formatDateOffset(
    estimate.minDays
  )} – ${formatDateOffset(estimate.maxDays)})`;

  if (!items.length) {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Checkout</h1>
          <p className="text-gray-400 mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handlePaystackPayment = async (orderId: string) => {
    try {
      const reference = paystackService.generateReference();
      
      paystackService.initializePayment({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        email: email,
        amount: grandTotal,
        currency: currency,
        reference: reference,
        callback: async (response: any) => {
          try {
            // Verify payment on backend
            const verification = await paystackService.verifyPayment(reference);
            if (verification?.status === 'success') {
              // Update order status to paid
              await updateOrderStatus(orderId, 'paid', reference);
              clear();
              navigate(`/orders/${orderId}?status=success`);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        onClose: () => {
          setError('Payment was cancelled. Please try again.');
        }
      });
    } catch (err) {
      console.error('Paystack initialization error:', err);
      setError('Failed to initialize payment. Please try again.');
    }
  };

  const handleMomoPayment = async (orderId: string) => {
    try {
      const reference = momoService.generateReference();
      // Initiate Mobile Money payment via backend (e.g., push to user's phone)
      await momoService.initiatePayment({
        phone: phone,
        email: email,
        amount: grandTotal,
        currency: currency,
        reference: reference,
      });

      // Poll verification a few times to check if payment completed
      const maxAttempts = 6;
      let attempt = 0;
      const poll = async (): Promise<void> => {
        try {
          const verification = await momoService.verifyPayment(reference);
          if (verification?.status === 'success') {
            await updateOrderStatus(orderId, 'paid', reference);
            clear();
            navigate(`/orders/${orderId}?status=success`);
            return;
          }
        } catch (err) {
          // fall through and retry until attempts exhausted
        }
        attempt++;
        if (attempt < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError('Mobile Money payment pending. If debited, contact support with your reference.');
        }
      };
      poll();
    } catch (err) {
      console.error('MoMo initialization error:', err);
      setError('Failed to initialize Mobile Money payment. Please try again.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, reference: string) => {
    try {
      await updateOrder(parseInt(orderId), { 
        status: status as any, 
        paymentReference: reference,
        paymentMethod: paymentMethod
      });
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!fullName || !email || !address) {
      setError('Please provide required shipping details.');
      return;
    }

    try {
      setPlacing(true);
      
      // Create order
      const order = await createOrder({
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          // Pass selected frame size when present (backend validates only for picture frames)
          selectedSize: i.selectedSize ?? null,
        })),
        shippingAddress: `${fullName}, ${address}, ${city}, ${country} ${postalCode}`.trim(),
        customerEmail: email,
        customerPhone: phone,
        currency: currency,
        totalAmount: grandTotal,
      });

      if (paymentMethod === 'paystack') {
        // Initialize Paystack payment
        await handlePaystackPayment(order.id.toString());
      } else if (paymentMethod === 'momo') {
        await handleMomoPayment(order.id.toString());
      } else {
        // Manual payment flow
        clear();
        navigate(`/orders/${order.id}?status=pending`);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create order.');
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>
        {error && <div className="p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-300 mb-6">{error}</div>}

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Shipping Information</h2>
              <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300 mb-2 block">Full Name</span>
            <input 
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300 mb-2 block">Email Address</span>
            <input 
              type="email"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300 mb-2 block">Phone Number</span>
            <input 
              type="tel"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300 mb-2 block">Address</span>
            <input 
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-300 mb-2 block">City</span>
              <input 
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-300 mb-2 block">Country</span>
              <select 
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
              >
                <option value="Ghana">Ghana</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-gray-300 mb-2 block">Postal Code</span>
            <input 
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value)} 
            />
          </label>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
              <div className="space-y-4">
                          <ul className="divide-y divide-dark-600">
                {items.map(i => (
                  <li key={i.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{i.name}</div>
                      <div className="text-sm text-gray-400">Qty: {i.quantity}</div>
                    </div>
                    <div className="font-medium text-white">GH₵{(i.price * i.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dark-600 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Subtotal</span>
                  <span className="text-sm text-gray-200">GH₵{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Delivery</span>
                  {isFreeShipping ? (
                    <span className="text-sm text-green-400">Free</span>
                  ) : (
                    <span className="text-sm text-gray-200">GH₵{deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Estimated Delivery</span>
                  <span className="text-xs text-gray-200 text-right">
                    {estimatedRangeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dark-600">
                  <span className="text-lg font-semibold text-white">Grand Total</span>
                  <span className="text-2xl font-bold text-white">GH₵{grandTotal.toFixed(2)}</span>
                </div>
              </div>
                      </div>
          </div>

          <div className="space-y-3">
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'momo' | 'paystack' | 'manual')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white">Mobile Money (MTN, Vodafone, AirtelTigo)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'momo' | 'paystack' | 'manual')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white">Paystack (Secure Online Payment)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="manual"
                    checked={paymentMethod === 'manual'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'momo' | 'paystack' | 'manual')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white">Manual Payment (Bank Transfer)</span>
                </label>
              </div>
              
              {paymentMethod === 'paystack' && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-primary text-sm">
                    💳 Secure payment powered by Paystack. You'll be redirected to a secure payment page.
                  </p>
                </div>
              )}
              
              {paymentMethod === 'manual' && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-500 text-sm">
                    🏦 Bank transfer details will be provided after order confirmation.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing
                ? 'Processing…'
                : paymentMethod === 'paystack'
                  ? 'Pay with Paystack'
                  : paymentMethod === 'momo'
                    ? 'Pay with Mobile Money'
                    : 'Pay with Bank Transfer'}
            </button>
            <button
              type="button"
              className="w-full py-3 rounded-lg border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors duration-200"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
        </aside>
      </form>
      </div>
    </div>
  );
};

export default Checkout;
