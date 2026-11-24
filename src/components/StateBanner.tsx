import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = { loading: boolean; offline: boolean; onRetry: () => void };

/** Индикатор загрузки и предупреждение «сервер недоступен». */
export default function StateBanner({ loading, offline, onRetry }: Props) {
  if (loading) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color={colors.primary} />
        <Text style={s.loadingText}>Loading…</Text>
      </View>
    );
  }
  if (!offline) return null;
  return (
    <View style={s.offline}>
      <Text style={s.offlineText}>Сервер недоступен — показаны демо-данные.</Text>
      <Pressable onPress={onRetry}><Text style={s.retry}>Повторить</Text></Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  loading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  loadingText: { color: colors.muted },
  offline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: 12, marginTop: 14 },
  offlineText: { flex: 1, color: colors.text, fontSize: 13 },
  retry: { color: colors.primary, fontWeight: '800' },
});
