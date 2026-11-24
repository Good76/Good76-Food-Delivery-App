import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 4000;

/**
 * Адрес API:
 * 1) EXPO_PUBLIC_API_URL (например, в файле .env) — если задан, используется он;
 * 2) web — тот же хост, что у страницы;
 * 3) телефон/эмулятор в Expo Go — IP компьютера, с которого раздаётся Metro;
 * 4) запасной вариант: Android-эмулятор → 10.0.2.2, iOS-симулятор → localhost.
 */
export function getApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${PORT}`;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${PORT}`;

  return Platform.OS === 'android' ? `http://10.0.2.2:${PORT}` : `http://localhost:${PORT}`;
}
