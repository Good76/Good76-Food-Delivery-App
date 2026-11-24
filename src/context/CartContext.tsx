import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { CardInfo, CartItem, Food, Size } from '../types';

export const sizeMultiplier: Record<Size, number> = { 10: 0.8, 14: 1, 16: 1.2 };
export const unitPrice = (food: Food, size: Size) =>
  Math.round(food.price * sizeMultiplier[size] * 100) / 100;

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (food: Food, size: Size, qty?: number) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  card: CardInfo | null;
  saveCard: (c: CardInfo | null) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [card, setCard] = useState<CardInfo | null>(null);

  const value = useMemo<CartCtx>(() => {
    const add: CartCtx['add'] = (food, size, qty = 1) =>
      setItems((prev) => {
        const key = `${food.id}-${size}`;
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { key, food, size, qty }];
      });
    const inc = (key: string) => setItems((p) => p.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)));
    const dec = (key: string) =>
      setItems((p) => p.flatMap((i) => (i.key !== key ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : [])));
    const remove = (key: string) => setItems((p) => p.filter((i) => i.key !== key));
    const clear = () => setItems([]);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + unitPrice(i.food, i.size) * i.qty, 0);
    return { items, count, total, add, inc, dec, remove, clear, card, saveCard: setCard };
  }, [items, card]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}
