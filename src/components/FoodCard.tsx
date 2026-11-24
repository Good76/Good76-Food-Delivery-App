import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Food } from '../types';

type Props = { food: Food; onPress: () => void; onAdd: () => void; style?: ViewStyle };

export default function FoodCard({ food, onPress, onAdd, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[s.card, style]}>
      <View style={s.image}>
        <Text style={{ fontSize: 56 }}>{food.emoji}</Text>
      </View>
      <Text style={s.name} numberOfLines={1}>{food.name}</Text>
      <Text style={s.sub} numberOfLines={1}>{food.restaurant}</Text>
      <View style={s.row}>
        <Text style={s.price}>${food.price}</Text>
        <Pressable onPress={onAdd} hitSlop={8} style={s.add}>
          <Ionicons name="add" size={18} color={colors.white} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { width: 160, backgroundColor: colors.white, borderRadius: radius.lg, padding: 10, marginRight: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  image: { height: 100, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  name: { marginTop: 10, fontSize: 14, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: '800', color: colors.text },
  add: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
