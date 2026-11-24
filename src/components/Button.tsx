import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

type Props = { title: string; onPress: () => void; variant?: 'solid' | 'outline'; style?: ViewStyle };

export default function Button({ title, onPress, variant = 'solid', style }: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.btn, outline && s.outline, pressed && { opacity: 0.85 }, style]}
    >
      <Text style={[s.text, outline && { color: colors.primary }]}>{title.toUpperCase()}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { backgroundColor: colors.primary, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  text: { color: colors.white, fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },
});
