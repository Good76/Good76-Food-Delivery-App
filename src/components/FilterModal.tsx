import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, radius } from '../theme';

export type Filters = { time: number | null; price: 1 | 2 | 3 | null; rating: number };
export const emptyFilters: Filters = { time: null, price: null, rating: 0 };

const times: { label: string; value: number }[] = [
  { label: '10-15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
];
const prices: { label: string; value: 1 | 2 | 3 }[] = [
  { label: '$', value: 1 },
  { label: '$$', value: 2 },
  { label: '$$$', value: 3 },
];

type Props = { visible: boolean; value: Filters; onApply: (f: Filters) => void; onClose: () => void };

export default function FilterModal({ visible, value, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<Filters>(value);
  useEffect(() => { if (visible) setDraft(value); }, [visible, value]);

  const chip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable key={label} onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.top}>
            <Text style={s.title}>Filter your search</Text>
            <Pressable onPress={onClose} style={s.close}><Ionicons name="close" size={18} color={colors.dark} /></Pressable>
          </View>

          <Text style={s.label}>DELIVER TIME</Text>
          <View style={s.row}>
            {times.map((t) => chip(t.label, draft.time === t.value, () => setDraft({ ...draft, time: draft.time === t.value ? null : t.value })))}
          </View>

          <Text style={s.label}>PRICING</Text>
          <View style={s.row}>
            {prices.map((p) => chip(p.label, draft.price === p.value, () => setDraft({ ...draft, price: draft.price === p.value ? null : p.value })))}
          </View>

          <Text style={s.label}>MIN RATING</Text>
          <View style={s.row}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setDraft({ ...draft, rating: draft.rating === n ? 0 : n })} style={s.star}>
                <Ionicons name={n <= draft.rating ? 'star' : 'star-outline'} size={22} color={colors.primary} />
              </Pressable>
            ))}
          </View>

          <View style={{ height: 24 }} />
          <Button title="Filter" onPress={() => { onApply(draft); onClose(); }} />
          <Pressable onPress={() => setDraft(emptyFilters)} style={{ alignItems: 'center', marginTop: 14 }}>
            <Text style={{ color: colors.muted }}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(24,28,46,0.65)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: 24 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 22, marginBottom: 10, fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 18, height: 40, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  star: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
