import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { unitPrice, useCart } from '../context/CartContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { Size } from '../types';

const sizes: Size[] = [10, 14, 16];

export default function DetailsScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Details'>) {
  const { getFood } = useData();
  const food = getFood(route.params.foodId);
  const { add } = useCart();
  const [size, setSize] = useState<Size>(14);
  const [qty, setQty] = useState(1);

  if (!food) return null;
  const total = unitPrice(food, size) * qty;

  return (
    <SafeAreaView style={s.safe}>
      <Header title="Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.image}><Text style={{ fontSize: 120 }}>{food.emoji}</Text></View>
        <View style={s.tag}><Text style={s.tagText}>{food.restaurant}</Text></View>
        <Text style={s.title}>{food.name}</Text>
        <Text style={s.desc}>{food.description}</Text>

        <View style={s.meta}>
          <Ionicons name="star-outline" size={18} color={colors.star} /><Text style={s.metaText}>{food.rating}</Text>
          <Ionicons name="bicycle-outline" size={18} color={colors.star} style={{ marginLeft: 18 }} /><Text style={s.metaText}>Free</Text>
          <Ionicons name="time-outline" size={18} color={colors.star} style={{ marginLeft: 18 }} /><Text style={s.metaText}>{food.deliveryMin} min</Text>
        </View>

        <Text style={s.label}>SIZE:</Text>
        <View style={s.sizes}>
          {sizes.map((sz) => (
            <Pressable key={sz} onPress={() => setSize(sz)} style={[s.size, sz === size && s.sizeActive]}>
              <Text style={[s.sizeText, sz === size && { color: colors.white }]}>{sz}"</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <View style={s.row}>
          <Text style={s.total}>${total.toFixed(2)}</Text>
          <View style={s.qty}>
            <Pressable onPress={() => setQty(Math.max(1, qty - 1))}><Ionicons name="remove" size={18} color={colors.white} /></Pressable>
            <Text style={s.qtyText}>{qty}</Text>
            <Pressable onPress={() => setQty(qty + 1)}><Ionicons name="add" size={18} color={colors.white} /></Pressable>
          </View>
        </View>
        <Button
          title="Add to cart"
          onPress={() => {
            add(food, size, qty);
            navigation.navigate('Main', { screen: 'Cart' });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  image: { height: 220, borderRadius: radius.xl, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  tag: { alignSelf: 'flex-start', marginTop: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  tagText: { fontSize: 12, color: colors.text },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 14 },
  desc: { fontSize: 14, color: colors.muted, marginTop: 8, lineHeight: 22 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 6 },
  metaText: { fontWeight: '700', color: colors.text },
  label: { marginTop: 24, fontSize: 13, color: colors.muted },
  sizes: { flexDirection: 'row', gap: 12, marginTop: 10 },
  size: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  sizeActive: { backgroundColor: colors.primary },
  sizeText: { fontWeight: '700', color: colors.text },
  footer: { padding: 20, backgroundColor: colors.field, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  total: { fontSize: 28, fontWeight: '800', color: colors.text },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 18, backgroundColor: colors.dark, borderRadius: radius.pill, paddingHorizontal: 18, height: 48 },
  qtyText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
