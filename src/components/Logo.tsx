import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function Logo({ size = 56 }: { size?: number }) {
  const dot = size * 0.5;
  return (
    <View style={s.row}>
      <Text style={[s.letter, { fontSize: size }]}>F</Text>
      <View style={[s.dot, { width: dot, height: dot, borderRadius: dot / 2 }]} />
      <View style={[s.dot, { width: dot, height: dot, borderRadius: dot / 2 }]} />
      <Text style={[s.letter, { fontSize: size }]}>d</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  letter: { fontWeight: '900', color: colors.dark, lineHeight: undefined },
  dot: { backgroundColor: colors.primary, marginHorizontal: 2, marginBottom: 6 },
});
