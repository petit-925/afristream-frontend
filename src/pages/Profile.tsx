import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';
import { changePassword, updateProfile, getWishlist, removeWishlistItem, type WishlistList } from '../api';
import { 
  User, MapPin, Upload, X, Eye,Download,  Plus, Edit, Trash2, Shield, 
  LogOut, HelpCircle,Package,Heart
} from 'lucide-react';
import Toast from '../components/ui/Toast';
import type { 
  Address, 
  WishlistItem, 
  UserSession, 
  SupportTicket, 
  Order 
} from '../types/user';

const Profile: React.FC = () => {
  const { user, refreshMe } = useAuth();
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  const { addItem } = useCart();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Profile Overview state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password change state
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [changing, setChanging] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Wishlist state (multi-list)
  const [wishlistLists, setWishlistLists] = useState<WishlistList[]>([]);
  const [activeWishlistList, setActiveWishlistList] = useState<string>('All');

  // Security state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // Support state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    addresses: false,
    orders: false,
    wishlist: false,
    sessions: false,
    tickets: false
  });

  if (!user) return null;

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 5;
    
    if (name) completed++;
    if (email) completed++;
    if (phone) completed++;
    if (address) completed++;
    if (avatar) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Load data based on active tab
  useEffect(() => {
    if (!user) return;

    if (activeTab === 'addresses') {
      loadAddresses();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'wishlist') {
      loadWishlist();
    } else if (activeTab === 'security') {
      loadSessions();
    } else if (activeTab === 'support') {
      loadTickets();
    }
  }, [activeTab, user]);

  // Mock data loading functions (replace with actual API calls)
  const loadAddresses = async () => {
    setLoading(prev => ({ ...prev, addresses: true }));
    // Mock data - replace with actual API call
    setTimeout(() => {
      setAddresses([
        {
          id: 1,
          fullName: 'John Doe',
          street: '123 Main St',
          city: 'Accra',
          region: 'Greater Accra',
          zipCode: 'GA-123',
          phone: '+233123456789',
          isDefault: true,
          userId: user?.id || 0
        }
      ]);
      setLoading(prev => ({ ...prev, addresses: false }));
    }, 1000);
  };

  const loadOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    // Mock data - replace with actual API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          userId: user?.id || 0,
          total: 299.99,
          status: 'delivered',
          shippingAddress: '123 Main St, Accra',
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'Sample Product',
              price: 149.99,
              quantity: 2,
              imageUrl: 'https://via.placeholder.com/100'
            }
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        }
      ]);
      setLoading(prev => ({ ...prev, orders: false }));
    }, 1000);
  };

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, wishlist: true }));
    try {
      const lists = await getWishlist();
      setWishlistLists(lists);
    } catch (wishlistError: any) {
      console.error('Failed to load wishlist', wishlistError);
      showError('Wishlist error', wishlistError?.message || 'Failed to load wishlist.');
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }));
    }
  };

  const loadSessions = async () => {
    setLoading(prev => ({ ...prev, sessions: true }));
    // Mock data - replace with actual API call
    setTimeout(() => {
      setSessions([
        {
          id: '1',
          deviceType: 'Desktop',
          browser: 'Chrome 120.0',
          lastLogin: '2024-01-20T14:45:00Z',
          ipAddress: '192.168.1.1',
          isCurrent: true
        }
      ]);
      setLoading(prev => ({ ...prev, sessions: false }));
    }, 1000);
  };

  const loadTickets = async () => {
    setLoading(prev => ({ ...prev, tickets: true }));
    // Mock data - replace with actual API call
    setTimeout(() => {
      setTickets([
        {
          id: 1,
          subject: 'Order Issue',
          description: 'My order was not delivered',
          status: 'open',
          priority: 'medium',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          userId: user?.id || 0
        }
      ]);
      setLoading(prev => ({ ...prev, tickets: false }));
    }, 1000);
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({ name, email, phone, address, avatar });
      await refreshMe();
      showSuccess('Profile Updated', 'Your profile has been updated successfully.');
    } catch (e: any) {
      showError('Update Failed', e?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!curPwd || !newPwd) {
      showError('Validation Error', 'Please provide both current and new password.');
      return;
    }
    try {
      setChanging(true);
      await changePassword({ currentPassword: curPwd, newPassword: newPwd });
      showSuccess('Password Changed', 'Your password has been changed successfully.');
      setCurPwd(''); 
      setNewPwd('');
    } catch (e: any) {
      showError('Password Change Failed', e?.response?.data?.message || 'Failed to change password.');
    } finally {
      setChanging(false);
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);
      // Mock upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUrl = URL.createObjectURL(file);
      setAvatar(mockUrl);
      showSuccess('Avatar Updated', 'Your profile picture has been updated.');
    } catch (error) {
      showError('Upload Failed', 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveWishlist = async (id: number) => {
    try {
      await removeWishlistItem(id);
      setWishlistLists(prev =>
        prev.map(list => ({
          ...list,
          items: list.items.filter(item => item.id !== id),
        }))
      );
      showSuccess('Wishlist updated', 'Item removed from your wishlist.');
    } catch (error: any) {
      console.error('Failed to remove wishlist item', error);
      showError('Wishlist error', error?.message || 'Failed to remove wishlist item.');
    }
  };

  const handleWishlistAddToCart = (item: WishlistItem) => {
    addItem(
      { id: item.product.id, name: item.product.name, price: item.product.price, imageUrl: item.product.imageUrl },
      1
    );
    showSuccess('Added to cart', `${item.product.name} has been added to your cart.`);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    showSuccess('Avatar Removed', 'Your profile picture has been removed.');
  };

  const tabs = [
    { id: 'overview', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const renderProfileOverview = () => (
    <div className="space-y-6">
      {/* Profile Completion */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Profile Completion</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Complete your profile</span>
            <span className="text-white font-medium">{calculateProfileCompletion()}%</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProfileCompletion()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-dark-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-dark-600 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {avatar ? 'Change Photo' : 'Upload Photo'}
            </label>
            {avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">Profile Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-gray-300 mb-2 block">Name</span>
                  <input 
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-300 mb-2 block">Email</span>
                  <input 
                    type="email" 
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-300 mb-2 block">Phone</span>
                  <input 
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                    value={phone || ''} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-gray-300 mb-2 block">Address</span>
                  <textarea 
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                    value={address || ''} 
                    onChange={e => setAddress(e.target.value)} 
                    rows={3} 
                  />
                </label>
              </div>
              <button 
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200 disabled:opacity-50" 
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">Order History</h2>
        {loading.orders ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-dark-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium">Order #{order.id}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">GH₵{order.total.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-900/50 text-green-300' :
                      order.status === 'shipped' ? 'bg-blue-900/50 text-blue-300' :
                      order.status === 'processing' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-gray-900/50 text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => showInfo('Order Details', `Order #${order.id} details will be shown here.`)}
                    className="flex items-center px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Shipping Addresses</h2>
          <button
            onClick={() => showInfo('Coming Soon', 'Address management will be available soon.')}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </button>
        </div>
        {loading.addresses ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No addresses found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-dark-600 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-medium">{addr.fullName}</h3>
                      {addr.isDefault && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{addr.street}</p>
                    <p className="text-gray-300 text-sm">
                      {addr.city}, {addr.region} {addr.zipCode}
                    </p>
                    <p className="text-gray-400 text-sm">{addr.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
              </div>
            )}
      </div>
    </div>
  );

  const renderWishlist = () => {
    const allLists = wishlistLists;
    const allItems = allLists.flatMap(l => l.items);
    const activeItems =
      activeWishlistList === 'All'
        ? allItems
        : (allLists.find(l => l.name === activeWishlistList)?.items ?? []);

    return (
      <div className="space-y-6">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Wishlist</h2>
          </div>
          {loading.wishlist ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No items in wishlist</p>
            </div>
          ) : (
            <>
              {/* List selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeWishlistList === 'All'
                        ? 'bg-primary text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                    onClick={() => setActiveWishlistList('All')}
                  >
                    All ({allItems.length})
                  </button>
                  {allLists.map(list => (
                    <button
                      key={list.name}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activeWishlistList === list.name
                          ? 'bg-primary text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                      onClick={() => setActiveWishlistList(list.name)}
                    >
                      {list.name} ({list.items.length})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeItems.map((item) => (
                  <div key={item.id} className="border border-dark-600 rounded-lg p-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="text-white font-medium mb-1">{item.product.name}</h3>
                    {item.listName && (
                      <p className="text-xs text-gray-400 mb-1">List: {item.listName}</p>
                    )}
                    <p className="text-primary font-semibold mb-3">
                      GH₵{item.product.price.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm transition-colors"
                        onClick={() => handleWishlistAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        onClick={() => handleRemoveWishlist(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
            
  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">Current Password</span>
                <input 
                  type="password" 
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                  value={curPwd} 
                  onChange={e => setCurPwd(e.target.value)} 
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">New Password</span>
                <input 
                  type="password" 
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                  value={newPwd} 
                  onChange={e => setNewPwd(e.target.value)} 
                  required
                />
              </label>
              <button 
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200 disabled:opacity-50" 
                disabled={changing}
              >
                {changing ? 'Updating…' : 'Change Password'}
              </button>
            </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Enable 2FA for extra security</p>
            <p className="text-gray-400 text-sm">Add an extra layer of protection to your account</p>
          </div>
          <button
            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFAEnabled ? 'bg-primary' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFAEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-white">Active Sessions</h2>
        {loading.sessions ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-dark-600 rounded-lg">
                <div>
                  <p className="text-white font-medium">{session.deviceType}</p>
                  <p className="text-gray-400 text-sm">{session.browser}</p>
                  <p className="text-gray-400 text-sm">Last login: {new Date(session.lastLogin).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">IP: {session.ipAddress}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {session.isCurrent && (
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                      Current
                    </span>
                  )}
                  {!session.isCurrent && (
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-300">Delete Account</h2>
        <p className="text-gray-300 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => showError('Account Deletion', 'Account deletion is not available in demo mode.')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Support Tickets</h2>
          <button
            onClick={() => showInfo('Support Tickets', 'Support ticket creation will be available soon.')}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button>
        </div>
        {loading.tickets ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No support tickets</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-dark-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{ticket.subject}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-yellow-900/50 text-yellow-300' :
                    ticket.status === 'in_progress' ? 'bg-blue-900/50 text-blue-300' :
                    ticket.status === 'resolved' ? 'bg-green-900/50 text-green-300' :
                    'bg-gray-900/50 text-gray-300'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{ticket.description}</p>
                <p className="text-gray-500 text-xs">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-28 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-2 lg:col-span-3 bg-dark-800 border border-dark-700 rounded-lg p-4 h-fit sticky top-24">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center border border-dark-600">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <div className="text-white font-semibold">{name || user?.name}</div>
                <div className="text-gray-400 text-sm">{email || user?.email}</div>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                      isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="md:col-span-9 lg:col-span-9 min-h-[400px]">
            {activeTab === 'overview' && renderProfileOverview()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'addresses' && renderAddresses()}
            {activeTab === 'wishlist' && renderWishlist()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'support' && renderSupport()}
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default Profile;
