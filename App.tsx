import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import { DataProvider } from './src/context/DataContext';
import { UserProvider } from './src/context/UserContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <DataProvider>
          <CartProvider>
            <Navigation />
            <StatusBar style="dark" />
          </CartProvider>
        </DataProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
