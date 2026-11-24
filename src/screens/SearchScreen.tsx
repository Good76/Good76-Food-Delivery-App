import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import FoodCard from '../components/FoodCard';
import { recentKeywords } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function SearchScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Search'>) {
  const { add } = useCart();
  const { foods, restaurants } = useData();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(recentKeywords);

  const q = query.trim().toLowerCase();
  const foodResults = useMemo(
    () => (q ? foods.filter((f) => f.name.toLowerCase().includes(q) || f.restaurant.toLowerCase().includes(q) || f.categoryId.includes(q)) : []),
    [q, foods],
  );
  const restaurantResults = useMemo(
    () => (q ? restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.tags.toLowerCase().includes(q)) : restaurants),
    [q, restaurants],
  );

  const submit = () => {
    const v = query.trim();
    if (v) setRecent((p) => [v, ...p.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 8));
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.top}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Ionicons name="chevron-back" size={20} color={colors.text} /></Pressable>
        <Text style={s.title}>Search</Text>
      </View>
      <View style={s.inputWrap}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={s.input} autoFocus placeholder="Search dishes, restaurants" placeholderTextColor={colors.muted}
          value={query} onChangeText={setQuery} onSubmitEditing={submit} returnKeyType="search"
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={colors.muted} /></Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {!q && (
          <>
            <Text style={s.section}>Recent Keywords</Text>
            <View style={s.chips}>
              {recent.map((k) => (
                <Pressable key={k} style={s.chip} onPress={() => setQuery(k)}><Text style={s.chipText}>{k}</Text></Pressable>
              ))}
            </View>
          </>
        )}

        {q && foodResults.length === 0 && restaurantResults.length === 0 && (
          <Text style={s.empty}>No results for “{query}”.</Text>
        )}

        {restaurantResults.length > 0 && (
          <>
            <Text style={s.section}>{q ? 'Restaurants' : 'Suggested Restaurants'}</Text>
            {restaurantResults.map((r) => (
              <Pressable key={r.id} style={s.rRow} onPress={() => navigation.navigate('Restaurant', { restaurantId: r.id })}>
                <View style={[s.rThumb, { backgroundColor: r.color }]}><Text style={{ fontSize: 26 }}>{r.emoji}</Text></View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.rName}>{r.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Ionicons name="star-outline" size={14} color={colors.star} />
                    <Text style={s.rRating}>{r.rating}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}

        <Text style={s.section}>{q ? 'Dishes' : 'Popular Fast Food'}</Text>
        <View style={s.grid}>
          {(q ? foodResults : foods.slice(0, 4)).map((f) => (
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
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, gap: 14 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.field, borderRadius: radius.md, marginHorizontal: 20, marginTop: 16, paddingHorizontal: 16, height: 52 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  chipText: { color: colors.text, fontWeight: '600' },
  empty: { color: colors.muted, marginTop: 20 },
  rRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rThumb: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rName: { fontWeight: '700', color: colors.text },
  rRating: { fontWeight: '700', color: colors.text, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
