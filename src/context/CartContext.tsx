import React, { createContext, useCallback, useMemo, useState } from 'react';
import type { CartItem } from '../types/cart';

interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: { id: number; name: string; price: number; imageUrl?: string | null },
    qty?: number,
    options?: { selectedSize?: string | null }
  ) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clear: () => void;
  subtotal: number;
  total: number;
  count: number;
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clear: () => {},
  subtotal: 0,
  total: 0,
  count: 0,
});

const CART_KEY = 'cart_items';

function readCart(): CartItem[] {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return [];
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(readCart());

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(CART_KEY, JSON.stringify(next));
      }
    } catch {}
  }, []);

  const addItem = useCallback(
    (
      product: { id: number; name: string; price: number; imageUrl?: string | null },
      qty = 1,
      options?: { selectedSize?: string | null }
    ) => {
      const selectedSize = options?.selectedSize ?? null;
      persist(
        ((prev) => {
          const found = prev.find(
            (i) => i.id === product.id && (i.selectedSize ?? null) === selectedSize
          );
          if (found) {
            return prev.map((i) =>
              i.id === product.id && (i.selectedSize ?? null) === selectedSize
                ? { ...i, quantity: i.quantity + qty }
                : i
            );
          }
          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              quantity: qty,
              selectedSize,
            },
          ];
        })(items)
      );
    },
    [items, persist]
  );

  const removeItem = useCallback((id: number) => {
    persist(items.filter(i => i.id !== id));
  }, [items, persist]);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) return removeItem(id);
    persist(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [items, persist, removeItem]);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const total = subtotal; // tax/shipping could be added later
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items, addItem, removeItem, updateQty, clear, subtotal, total, count
  }), [items, addItem, removeItem, updateQty, clear, subtotal, total, count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
