import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import FoodCard from '../components/FoodCard';
import Header from '../components/Header';
import { api } from '../api/client';
import { categories } from '../data/mockData';
import { useData } from '../context/DataContext';
import { Food } from '../types';
import { useCart } from '../context/CartContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function RestaurantScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Restaurant'>) {
  const id = route.params.restaurantId;
  const { restaurants, foods } = useData();
  const r = restaurants.find((x) => x.id === id);
  const { add } = useCart();
  const [cat, setCat] = useState('all');
  const [remoteMenu, setRemoteMenu] = useState<Food[] | null>(null);
  const [menuLoading, setMenuLoading] = useState(true);

  // Свежее меню ресторана с сервера (GET /api/restaurants/:id)
  useEffect(() => {
    let alive = true;
    api.getRestaurant(id)
      .then((d) => { if (alive) setRemoteMenu(d.menu); })
      .catch(() => {}) // при ошибке остаётся локальное меню
      .finally(() => { if (alive) setMenuLoading(false); });
    return () => { alive = false; };
  }, [id]);

  const menu = useMemo(() => remoteMenu ?? foods.filter((f) => f.restaurantId === id), [remoteMenu, foods, id]);
  const cats = useMemo(() => {
    const ids = Array.from(new Set(menu.map((f) => f.categoryId)));
    return ids.map((id) => ({ id, name: categories.find((c) => c.id === id)?.name ?? id, count: menu.filter((f) => f.categoryId === id).length }));
  }, [menu]);
  const shown = cat === 'all' ? menu : menu.filter((f) => f.categoryId === cat);

  if (!r) return null;

  return (
    <SafeAreaView style={s.safe}>
      <Header title="Restaurant View" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={[s.banner, { backgroundColor: r.color }]}><Text style={{ fontSize: 90 }}>{r.emoji}</Text></View>
        <Text style={s.name}>{r.name}</Text>
        <View style={s.meta}>
          <Ionicons name="star-outline" size={16} color={colors.star} /><Text style={s.metaText}>{r.rating}</Text>
          <Ionicons name="bicycle-outline" size={16} color={colors.star} style={{ marginLeft: 14 }} /><Text style={s.metaText}>{r.deliveryFee}</Text>
          <Ionicons name="time-outline" size={16} color={colors.star} style={{ marginLeft: 14 }} /><Text style={s.metaText}>{r.deliveryMin} min</Text>
        </View>
        <Text style={s.about}>{r.about}</Text>

        <FlatList
          horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18 }}
          data={[{ id: 'all', name: 'All', count: menu.length }, ...cats]} keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => setCat(item.id)} style={[s.chip, item.id === cat && s.chipActive]}>
              <Text style={[s.chipText, item.id === cat && { color: colors.white }]}>{item.name} ({item.count})</Text>
            </Pressable>
          )}
        />

        {menuLoading && <ActivityIndicator color={colors.primary} style={{ marginTop: 14 }} />}
        <Text style={s.section}>{cat === 'all' ? 'Menu' : categories.find((c) => c.id === cat)?.name} ({shown.length})</Text>
        <View style={s.grid}>
          {shown.map((f) => (
            <FoodCard
              key={f.id} food={f} style={{ width: '48%', marginRight: 0, marginBottom: 14 }}
              onPress={() => navigation.navigate('Details', { foodId: f.id })} onAdd={() => add(f, 14)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  banner: { height: 170, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 4 },
  metaText: { fontWeight: '700', color: colors.text },
  about: { color: colors.muted, lineHeight: 22, marginTop: 14 },
  chip: { paddingHorizontal: 16, height: 40, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', marginRight: 10 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginVertical: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
