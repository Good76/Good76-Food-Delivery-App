import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { addresses as initialAddresses, user as initialUser } from '../data/mockData';
import { Address, User } from '../types';

type Ctx = {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  defaultAddress: string;
};

const C = createContext<Ctx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const value = useMemo<Ctx>(
    () => ({
      user,
      updateUser: (patch) => setUser((u) => ({ ...u, ...patch })),
      addresses,
      addAddress: (a) => setAddresses((p) => [...p, { ...a, id: `a${Date.now()}` }]),
      removeAddress: (id) => setAddresses((p) => p.filter((a) => a.id !== id)),
      defaultAddress: addresses[0]?.address ?? 'Add a delivery address',
    }),
    [user, addresses],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useUser() {
  const c = useContext(C);
  if (!c) throw new Error('useUser must be used inside UserProvider');
  return c;
}
