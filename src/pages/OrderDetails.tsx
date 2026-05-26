import React, { useEffect, useState } from 'react';

import { getOrder } from '../api';
import type { Order } from '../types/order';
import { useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getOrder(Number(id));
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading order…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-red-400 text-lg">Order not found.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Order #{order.id}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              order.status === 'completed' ? 'bg-green-900/50 text-green-300 border border-green-700' :
              order.status === 'processing' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
              order.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
              'bg-gray-900/50 text-gray-300 border border-gray-700'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-dark-600">
              <h2 className="text-xl font-semibold text-white">Order Items</h2>
            </div>
            <ul>
              {order.items.map((it: any, idx: number) => (
                <li key={idx} className="flex items-center gap-4 p-6 border-b border-dark-600 last:border-b-0 hover:bg-dark-700 transition-colors duration-200">
                  <img src={it.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'} alt={it.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg">{it.name}</div>
                    {it.selected_size && (
                      <div className="text-xs text-gray-400">Size: {it.selected_size}</div>
                    )}
                    <div className="text-sm text-gray-400">Quantity: {it.quantity}</div>
                  </div>
                  <div className="font-semibold text-white text-lg">GH₵{(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-dark-700 border-t border-dark-600">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Shipping Address</div>
                  <div className="font-medium text-white">{order.shippingAddress || 'N/A'}</div>
                </div>
                <div className="text-2xl font-bold text-white">Total: GH₵{order.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <button
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200"
            onClick={() => {
              order.items.forEach((it: any) =>
                addItem(
                  { id: it.productId, name: it.name, price: it.price, imageUrl: it.imageUrl },
                  it.quantity,
                  { selectedSize: it.selected_size ?? null }
                )
              );
            }}
          >
            Re-order These Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
