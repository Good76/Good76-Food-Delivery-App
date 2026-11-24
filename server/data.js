// Сгенерировано из src/data/mockData.js — это «база данных» учебного сервера.
const categories = [
  { id: 'all', name: 'All', emoji: '🔥' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burger', name: 'Burger', emoji: '🍔' },
  { id: 'hotdog', name: 'Hot Dog', emoji: '🌭' },
  { id: 'sandwich', name: 'Sandwich', emoji: '🥪' },
  { id: 'salad', name: 'Salad', emoji: '🥗' },
];

const restaurants = [
  { id: 'r1', name: 'Rose Garden Restaurant', tags: 'Burger - Chicken - Riche - Wings', rating: 4.7, deliveryFee: 'Free', deliveryMin: 20, emoji: '🥘', color: '#FFE2CF', about: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus.' },
  { id: 'r2', name: 'Spicy Restaurant', tags: 'Burger - Sandwich - Pizza', rating: 4.5, deliveryFee: 'Free', deliveryMin: 25, emoji: '🍖', color: '#E6F0FF', about: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.' },
  { id: 'r3', name: 'Tasty Treat Gallery', tags: 'Salad - Brunch - Bowls', rating: 4.3, deliveryFee: '$2', deliveryMin: 15, emoji: '🥗', color: '#E4F7EC', about: 'Fresh bowls, salads and brunch plates made every morning from local ingredients.' },
  { id: 'r4', name: 'Pansi Restaurant', tags: 'Sandwich - Burger - Fast Food', rating: 4.0, deliveryFee: 'Free', deliveryMin: 30, emoji: '🥪', color: '#FFF4CC', about: 'Quick, filling sandwiches and burgers for the lunch rush.' },
];

const foods = [
  { id: 'f1', name: 'Pizza Calzone European', restaurant: 'Rose Garden Restaurant', restaurantId: 'r1', categoryId: 'pizza', price: 32, rating: 4.7, emoji: '🍕', deliveryMin: 20, description: 'Prosciutto e funghi is a pizza variety that is topped with tomato sauce.' },
  { id: 'f2', name: 'Buffalo Pizza', restaurant: 'Spicy Restaurant', restaurantId: 'r2', categoryId: 'pizza', price: 70, rating: 4.5, emoji: '🍕', deliveryMin: 25, description: 'Spicy buffalo chicken on a thin crust with mozzarella.' },
  { id: 'f3', name: 'Burger Ferguson', restaurant: 'Spicy Restaurant', restaurantId: 'r2', categoryId: 'burger', price: 40, rating: 4.6, emoji: '🍔', deliveryMin: 15, description: 'Double beef patty, cheddar, pickles and house sauce.' },
  { id: 'f4', name: "Rockin' Burgers", restaurant: 'Spicy Restaurant', restaurantId: 'r2', categoryId: 'burger', price: 60, rating: 4.4, emoji: '🍔', deliveryMin: 20, description: 'Smoked beef, bacon, onion rings and BBQ glaze.' },
  { id: 'f5', name: 'Buffalo Burgers', restaurant: 'Pansi Restaurant', restaurantId: 'r4', categoryId: 'burger', price: 75, rating: 4.3, emoji: '🍔', deliveryMin: 30, description: 'Crispy buffalo chicken with blue cheese dressing.' },
  { id: 'f6', name: 'Classic Hot Dog', restaurant: 'Rose Garden Restaurant', restaurantId: 'r1', categoryId: 'hotdog', price: 18, rating: 4.1, emoji: '🌭', deliveryMin: 10, description: 'Grilled sausage, mustard, ketchup and fried onions.' },
  { id: 'f7', name: 'Club Sandwich', restaurant: 'Pansi Restaurant', restaurantId: 'r4', categoryId: 'sandwich', price: 25, rating: 4.7, emoji: '🥪', deliveryMin: 15, description: 'Triple-decker with chicken, egg, lettuce and tomato.' },
  { id: 'f8', name: 'Greek Salad', restaurant: 'Tasty Treat Gallery', restaurantId: 'r3', categoryId: 'salad', price: 22, rating: 4.2, emoji: '🥗', deliveryMin: 12, description: 'Feta, olives, cucumber, tomato and oregano.' },
  { id: 'f9', name: 'Spicy Sandwich', restaurant: 'Spicy Restaurant', restaurantId: 'r2', categoryId: 'sandwich', price: 28, rating: 4.4, emoji: '🥪', deliveryMin: 18, description: 'Grilled chicken, jalapeños and chipotle mayo.' },
  { id: 'f10', name: 'Bullseye Burgers', restaurant: 'Pansi Restaurant', restaurantId: 'r4', categoryId: 'burger', price: 94, rating: 4.5, emoji: '🍔', deliveryMin: 30, description: 'Triple patty with fried egg and aged cheddar.' },
];


module.exports = { categories, restaurants, foods };
