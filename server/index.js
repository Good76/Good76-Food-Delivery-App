// Мини-API без зависимостей (только встроенный модуль http).
// Запуск: npm run server   →  http://localhost:4000/api/health
const http = require('http');
const { URL } = require('url');
const { categories, restaurants, foods } = require('./data');

const PORT = process.env.PORT || 4000;

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

const has = (text, q) => text.toLowerCase().includes(q.toLowerCase());

function listRestaurants(p) {
  const q = p.get('q');
  const minRating = Number(p.get('minRating') || 0);
  const maxTime = Number(p.get('maxTime') || 0);
  return restaurants.filter(
    (r) =>
      (!q || has(r.name, q) || has(r.tags, q)) &&
      r.rating >= minRating &&
      (!maxTime || r.deliveryMin <= maxTime),
  );
}

function listFoods(p) {
  const q = p.get('q');
  const restaurantId = p.get('restaurantId');
  const categoryId = p.get('categoryId');
  return foods.filter(
    (f) =>
      (!restaurantId || f.restaurantId === restaurantId) &&
      (!categoryId || categoryId === 'all' || f.categoryId === categoryId) &&
      (!q || has(f.name, q) || has(f.restaurant, q)),
  );
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/\/+$/, '');
  console.log(`${new Date().toISOString()}  GET ${req.url}`);

  try {
    if (path === '/api/health') return send(res, 200, { status: 'ok', time: new Date().toISOString() });
    if (path === '/api/categories') return send(res, 200, categories);
    if (path === '/api/restaurants') return send(res, 200, listRestaurants(url.searchParams));
    if (path === '/api/foods') return send(res, 200, listFoods(url.searchParams));

    let m = path.match(/^\/api\/restaurants\/([\w-]+)$/);
    if (m) {
      const r = restaurants.find((x) => x.id === m[1]);
      if (!r) return send(res, 404, { error: 'Restaurant not found' });
      return send(res, 200, { ...r, menu: foods.filter((f) => f.restaurantId === r.id) });
    }
    m = path.match(/^\/api\/foods\/([\w-]+)$/);
    if (m) {
      const f = foods.find((x) => x.id === m[1]);
      return f ? send(res, 200, f) : send(res, 404, { error: 'Food not found' });
    }
    return send(res, 404, { error: 'Not found' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Food API running on http://localhost:${PORT}`);
  console.log('Endpoints: /api/health /api/categories /api/restaurants /api/restaurants/:id /api/foods /api/foods/:id');
});
