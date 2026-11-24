import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api } from '../api/client';
import { foods as mockFoods, restaurants as mockRestaurants } from '../data/mockData';
import { Food, Restaurant } from '../types';

type Ctx = {
  restaurants: Restaurant[];
  foods: Food[];
  loading: boolean;
  /** true — сервер недоступен, показаны демо-данные из приложения */
  offline: boolean;
  reload: () => Promise<void>;
  getFood: (id: string) => Food | undefined;
};

const C = createContext<Ctx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [r, f] = await Promise.all([api.getRestaurants(), api.getFoods()]);
      setRestaurants(r);
      setFoods(f);
      setOffline(false);
    } catch {
      setRestaurants(mockRestaurants);
      setFoods(mockFoods);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<Ctx>(
    () => ({ restaurants, foods, loading, offline, reload, getFood: (id) => foods.find((f) => f.id === id) }),
    [restaurants, foods, loading, offline, reload],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useData() {
  const c = useContext(C);
  if (!c) throw new Error('useData must be used inside DataProvider');
  return c;
}
