import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = { title: string; onBack?: () => void; dark?: boolean; right?: React.ReactNode };

export default function Header({ title, onBack, dark, right }: Props) {
  const fg = dark ? colors.white : colors.text;
  return (
    <View style={s.row}>
      {onBack ? (
        <Pressable onPress={onBack} style={[s.circle, { backgroundColor: dark ? colors.darkSoft : colors.field }]}>
          <Ionicons name="chevron-back" size={20} color={fg} />
        </Pressable>
      ) : (
        <View style={s.circle} />
      )}
      <Text style={[s.title, { color: fg }]}>{title}</Text>
      <View style={s.circle}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  circle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
});
