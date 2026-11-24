import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { orders } from '../data/mockData';
import { colors, radius } from '../theme';

type Tab = 'ongoing' | 'history';
type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Orders'>, NativeStackScreenProps<RootStackParamList>>;

export default function OrdersScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>('ongoing');
  const data = orders.filter((o) => (tab === 'ongoing' ? o.status === 'ongoing' : o.status !== 'ongoing'));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Header title="My Orders" />
      <View style={s.tabs}>
        {(['ongoing', 'history'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[s.tab, tab === t && s.tabActive]}>
            <Text style={[s.tabText, tab === t && { color: colors.primary }]}>{t === 'ongoing' ? 'Ongoing' : 'History'}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.top}>
              <Text style={s.type}>{item.title}</Text>
              {item.status !== 'ongoing' && (
                <Text style={[s.status, { color: item.status === 'completed' ? colors.success : colors.danger }]}>
                  {item.status === 'completed' ? 'Completed' : 'Canceled'}
                </Text>
              )}
            </View>
            <View style={s.row}>
              <View style={s.thumb}><Text style={{ fontSize: 30 }}>{item.emoji}</Text></View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={s.between}>
                  <Text style={s.name}>{item.restaurant}</Text>
                  <Text style={s.id}>#{item.id}</Text>
                </View>
                <Text style={s.price}>${item.total.toFixed(2)}</Text>
                <Text style={s.date}>{item.date} • {item.items} Items</Text>
              </View>
            </View>
            <View style={s.actions}>
              {item.status === 'ongoing' ? (
                <>
                  <Pressable style={[s.btn, s.btnSolid]} onPress={() => navigation.navigate('TrackOrder')}><Text style={s.btnSolidText}>Track Order</Text></Pressable>
                  <Pressable style={[s.btn, s.btnOutline]}><Text style={s.btnOutlineText}>Cancel</Text></Pressable>
                </>
              ) : (
                <>
                  <Pressable style={[s.btn, s.btnOutline]}><Text style={s.btnOutlineText}>Rate</Text></Pressable>
                  <Pressable style={[s.btn, s.btnSolid]}><Text style={s.btnSolidText}>Re-Order</Text></Pressable>
                </>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.muted, fontWeight: '700' },
  card: { marginBottom: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  top: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  type: { fontSize: 14, color: colors.text },
  status: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row' },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  thumb: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '700', color: colors.text },
  id: { color: colors.muted, fontSize: 12 },
  price: { fontWeight: '800', color: colors.text, marginTop: 4 },
  date: { color: colors.muted, fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 16 },
  btn: { flex: 1, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  btnSolid: { backgroundColor: colors.primary },
  btnSolidText: { color: colors.white, fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: colors.primary },
  btnOutlineText: { color: colors.primary, fontWeight: '700' },
});
