'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ProductItem } from '@/lib/supabase';

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  qty: number;
};

type CartContextType = {
  lines: CartLine[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = 'shop_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      /* ignore corrupt cache */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addToCart(product: ProductItem) {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, image_url: product.image_url, qty: 1 }
      ];
    });
  }

  function removeFromCart(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) return removeFromCart(id);
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  }

  function clearCart() {
    setLines([]);
  }

  const totalCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const totalPrice = lines.reduce((sum, l) => sum + l.qty * l.price, 0);

  return (
    <CartContext.Provider
      value={{ lines, addToCart, removeFromCart, setQty, clearCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
