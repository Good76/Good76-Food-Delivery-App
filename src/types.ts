export type Category = { id: string; name: string; emoji: string };

export type Food = {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  categoryId: string;
  price: number;
  rating: number;
  emoji: string;
  description: string;
  deliveryMin: number;
};

export type Restaurant = {
  id: string;
  name: string;
  tags: string;
  rating: number;
  deliveryFee: string;
  deliveryMin: number;
  emoji: string;
  color: string;
  about: string;
};

export type Size = 10 | 14 | 16;

export type CartItem = {
  key: string;
  food: Food;
  size: Size;
  qty: number;
};

export type Order = {
  id: string;
  restaurant: string;
  title: string;
  total: number;
  items: number;
  date: string;
  status: 'ongoing' | 'completed' | 'canceled';
  emoji: string;
};

export type User = { name: string; email: string; phone: string; bio: string };

export type Address = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  street: string;
  postCode: string;
  apartment: string;
};

export type CardInfo = { brand: 'Visa' | 'Mastercard'; last4: string; holder: string };

export type RestaurantDetail = Restaurant & { menu: Food[] };
