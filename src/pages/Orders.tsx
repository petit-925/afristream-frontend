import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserOrders } from '../api';
import type { Order } from '../types/order';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getUserOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 border border-dark-700 rounded-lg animate-pulse bg-dark-800"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">My Orders</h1>
          {!orders.length ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No orders yet.</p>
              <Link 
                to="/shop" 
                className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-dark-700 text-left">
                    <tr>
                      <th className="p-4 border-b border-dark-600 text-gray-300 font-medium">Order #</th>
                      <th className="p-4 border-b border-dark-600 text-gray-300 font-medium">Date</th>
                      <th className="p-4 border-b border-dark-600 text-gray-300 font-medium">Status</th>
                      <th className="p-4 border-b border-dark-600 text-gray-300 font-medium">Total</th>
                      <th className="p-4 border-b border-dark-600 text-gray-300 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-dark-600 hover:bg-dark-700 transition-colors duration-200">
                        <td className="p-4 text-white font-medium">#{o.id}</td>
                        <td className="p-4 text-gray-300">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            o.status === 'completed' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                            o.status === 'processing' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                            o.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
                            'bg-gray-900/50 text-gray-300 border border-gray-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-white font-semibold">GH₵{o.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Link 
                            to={`/order/${o.id}`} 
                            className="text-primary hover:text-primary-light underline transition-colors duration-200"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
