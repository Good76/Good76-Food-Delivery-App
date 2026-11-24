import { Food, Restaurant, RestaurantDetail } from '../types';
import { getApiUrl } from './config';

const TIMEOUT_MS = 6000;

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${getApiUrl()}${path}`, { signal: controller.signal });
    if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError((e as Error).name === 'AbortError' ? 'Server timeout' : 'Network error');
  } finally {
    clearTimeout(timer);
  }
}

const qs = (params: Record<string, string | number | undefined>) => {
  const s = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return s ? `?${s}` : '';
};

export const api = {
  getRestaurants: (p: { q?: string; minRating?: number; maxTime?: number } = {}) =>
    request<Restaurant[]>(`/api/restaurants${qs(p)}`),
  getRestaurant: (id: string) => request<RestaurantDetail>(`/api/restaurants/${encodeURIComponent(id)}`),
  getFoods: (p: { q?: string; restaurantId?: string; categoryId?: string } = {}) =>
    request<Food[]>(`/api/foods${qs(p)}`),
  health: () => request<{ status: string }>('/api/health'),
};
