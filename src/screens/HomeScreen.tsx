import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryChip from '../components/CategoryChip';
import FilterModal, { emptyFilters, Filters } from '../components/FilterModal';
import FoodCard from '../components/FoodCard';
import OfferModal from '../components/OfferModal';
import RestaurantCard from '../components/RestaurantCard';
import StateBanner from '../components/StateBanner';
import { categories } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const tier = (price: number): 1 | 2 | 3 => (price < 30 ? 1 : price < 60 ? 2 : 3);

export default function HomeScreen({ navigation }: Props) {
  const { add, count } = useCart();
  const { foods, restaurants, loading, offline, reload } = useData();
  const { user, defaultAddress } = useUser();
  const [category, setCategory] = useState('all');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOfferOpen(true), 900);
    return () => clearTimeout(t);
  }, []);

  const active = filters.time !== null || filters.price !== null || filters.rating > 0;

  const filteredFoods = useMemo(
    () =>
      foods.filter(
        (f) =>
          (category === 'all' || f.categoryId === category) &&
          (filters.time === null || f.deliveryMin <= filters.time) &&
          (filters.price === null || tier(f.price) === filters.price) &&
          f.rating >= filters.rating,
      ),
    [category, filters, foods],
  );
  const filteredRestaurants = useMemo(
    () => restaurants.filter((r) => (filters.time === null || r.deliveryMin <= filters.time) && r.rating >= filters.rating),
    [filters, restaurants],
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && restaurants.length > 0} onRefresh={reload} tintColor={colors.primary} />}
      >
        <View style={s.top}>
          <View style={s.menu}><Ionicons name="menu" size={20} color={colors.text} /></View>
          <Pressable style={{ flex: 1, marginLeft: 14 }} onPress={() => navigation.navigate('Addresses')}>
            <Text style={s.deliver}>DELIVER TO</Text>
            <Text style={s.address} numberOfLines={1}>{defaultAddress} ▾</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Cart')} style={s.bag}>
            <Ionicons name="bag-outline" size={20} color={colors.white} />
            {count > 0 && <View style={s.badge}><Text style={s.badgeText}>{count}</Text></View>}
          </Pressable>
        </View>

        <StateBanner loading={loading && restaurants.length === 0} offline={offline} onRetry={reload} />

        <Text style={s.greeting}>Hey {user.name.split(' ')[0]}, <Text style={{ fontWeight: '800' }}>Good Afternoon!</Text></Text>

        <View style={s.searchRow}>
          <Pressable style={s.search} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <Text style={s.searchText}>Search dishes, restaurants</Text>
          </Pressable>
          <Pressable style={[s.filterBtn, active && { backgroundColor: colors.primary }]} onPress={() => setFilterOpen(true)}>
            <Ionicons name="options-outline" size={20} color={active ? colors.white : colors.text} />
          </Pressable>
        </View>

        <View style={s.sectionRow}>
          <Text style={s.section}>All Categories</Text>
          {active && (
            <Pressable onPress={() => setFilters(emptyFilters)}><Text style={s.link}>Clear filters</Text></Pressable>
          )}
        </View>
        <FlatList
          horizontal data={categories} keyExtractor={(c) => c.id} showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip category={item} active={item.id === category} onPress={() => setCategory(item.id)} />
          )}
        />

        <Text style={s.section}>Popular {category === 'all' ? 'Dishes' : categories.find((c) => c.id === category)?.name}</Text>
        {filteredFoods.length === 0 ? (
          <Text style={s.empty}>Nothing found. Try another category or reset the filters.</Text>
        ) : (
          <FlatList
            horizontal data={filteredFoods} keyExtractor={(f) => f.id} showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: 8 }}
            renderItem={({ item }) => (
              <FoodCard food={item} onPress={() => navigation.navigate('Details', { foodId: item.id })} onAdd={() => add(item, 14)} />
            )}
          />
        )}

        <View style={s.sectionRow}><Text style={s.section}>Open Restaurants</Text></View>
        {filteredRestaurants.length === 0 && <Text style={s.empty}>No restaurants match your filters.</Text>}
        {filteredRestaurants.map((r) => (
          <RestaurantCard key={r.id} r={r} onPress={() => navigation.navigate('Restaurant', { restaurantId: r.id })} />
        ))}
      </ScrollView>

      <FilterModal visible={filterOpen} value={filters} onApply={setFilters} onClose={() => setFilterOpen(false)} />
      <OfferModal visible={offerOpen} onClose={() => setOfferOpen(false)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center' },
  menu: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  deliver: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  address: { color: colors.text, fontSize: 14, marginTop: 2 },
  bag: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  greeting: { fontSize: 16, color: colors.text, marginTop: 22 },
  searchRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.field, borderRadius: radius.md, paddingHorizontal: 16, height: 52 },
  searchText: { color: colors.muted, fontSize: 14 },
  filterBtn: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 26, marginBottom: 14 },
  link: { color: colors.primary, fontWeight: '700', marginTop: 12 },
  empty: { color: colors.muted },
});
