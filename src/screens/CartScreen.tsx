import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { unitPrice, useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Cart'>, NativeStackScreenProps<RootStackParamList>>;

export default function CartScreen({ navigation }: Props) {
  const { items, total, inc, dec, remove } = useCart();
  const { defaultAddress } = useUser();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Header title="Cart" dark />
      {items.length === 0 ? (
        <View style={s.emptyWrap}>
          <Text style={{ fontSize: 64 }}>🛒</Text>
          <Text style={s.emptyTitle}>Your cart is empty</Text>
          <Text style={s.emptyText}>Add a dish from the home screen to start your order.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.key}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={s.item}>
              <View style={s.thumb}><Text style={{ fontSize: 40 }}>{item.food.emoji}</Text></View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.name} numberOfLines={2}>{item.food.name}</Text>
                <Text style={s.price}>${(unitPrice(item.food, item.size) * item.qty).toFixed(2)}</Text>
                <View style={s.sizeRow}>
                  <Text style={s.size}>{item.size}"</Text>
                  <View style={s.qty}>
                    <Pressable onPress={() => dec(item.key)} style={s.qtyBtn}><Ionicons name="remove" size={14} color={colors.white} /></Pressable>
                    <Text style={s.qtyText}>{item.qty}</Text>
                    <Pressable onPress={() => inc(item.key)} style={s.qtyBtn}><Ionicons name="add" size={14} color={colors.white} /></Pressable>
                  </View>
                </View>
              </View>
              <Pressable onPress={() => remove(item.key)} style={s.remove}>
                <Ionicons name="close" size={14} color={colors.white} />
              </Pressable>
            </View>
          )}
        />
      )}
      {items.length > 0 && (
        <View style={s.footer}>
          <Text style={s.small}>DELIVERY ADDRESS</Text>
          <View style={s.address}><Text style={{ color: colors.muted }}>{defaultAddress}</Text></View>
          <View style={s.totalRow}>
            <Text style={s.small}>TOTAL: <Text style={s.total}>${total.toFixed(2)}</Text></Text>
          </View>
          <Button title="Place order" onPress={() => navigation.navigate('Payment')} />
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.dark },
  emptyWrap: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 32, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 12 },
  emptyText: { color: colors.muted, marginTop: 6, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  thumb: { width: 100, height: 100, borderRadius: radius.lg, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.white, fontSize: 15, fontWeight: '600' },
  price: { color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 6 },
  sizeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  size: { color: colors.muted, fontSize: 14 },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' },
  qtyText: { color: colors.white, fontWeight: '700' },
  remove: { position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  footer: { backgroundColor: colors.white, padding: 24, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  small: { fontSize: 12, color: colors.muted },
  address: { backgroundColor: colors.field, borderRadius: radius.md, padding: 18, marginTop: 8 },
  totalRow: { marginVertical: 18 },
  total: { fontSize: 28, fontWeight: '800', color: colors.text },
});
