import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Restaurant } from '../types';

export default function RestaurantCard({ r, onPress }: { r: Restaurant; onPress?: () => void }) {
  return (
    <Pressable style={s.wrap} onPress={onPress}>
      <View style={[s.banner, { backgroundColor: r.color }]}>
        <Text style={{ fontSize: 72 }}>{r.emoji}</Text>
      </View>
      <Text style={s.name}>{r.name}</Text>
      <Text style={s.tags}>{r.tags}</Text>
      <View style={s.meta}>
        <Ionicons name="star-outline" size={16} color={colors.star} />
        <Text style={s.metaText}>{r.rating}</Text>
        <Ionicons name="bicycle-outline" size={16} color={colors.star} style={{ marginLeft: 14 }} />
        <Text style={s.metaText}>{r.deliveryFee}</Text>
        <Ionicons name="time-outline" size={16} color={colors.star} style={{ marginLeft: 14 }} />
        <Text style={s.metaText}>{r.deliveryMin} min</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 20 },
  banner: { height: 140, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  name: { marginTop: 10, fontSize: 18, fontWeight: '700', color: colors.text },
  tags: { fontSize: 13, color: colors.muted, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  metaText: { fontSize: 13, fontWeight: '700', color: colors.text },
});
