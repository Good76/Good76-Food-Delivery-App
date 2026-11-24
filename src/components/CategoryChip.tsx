import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';
import { Category } from '../types';

type Props = { category: Category; active: boolean; onPress: () => void };

export default function CategoryChip({ category, active, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.active]}>
      <Text style={s.emoji}>{category.emoji}</Text>
      <Text style={[s.label, active && { color: colors.white }]}>{category.name}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: radius.pill, backgroundColor: colors.white, marginRight: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  emoji: { fontSize: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
});
