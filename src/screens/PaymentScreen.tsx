import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

const methods = [
  { id: 'cash', label: 'Cash', emoji: '💵' },
  { id: 'visa', label: 'Visa', emoji: '💳' },
  { id: 'mastercard', label: 'Mastercard', emoji: '🟠' },
];

export default function PaymentScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Payment'>) {
  const { total, card } = useCart();
  const [method, setMethod] = useState('mastercard');
  const [error, setError] = useState('');

  const pay = () => {
    if (method !== 'cash' && !card) return setError('Сначала добавьте карту или выберите оплату наличными');
    navigation.replace('Success');
  };

  return (
    <SafeAreaView style={s.safe}>
      <Header title="Payment" onBack={() => navigation.goBack()} />
      <View style={s.body}>
        <View style={s.methods}>
          {methods.map((m) => (
            <Pressable key={m.id} onPress={() => { setMethod(m.id); setError(''); }} style={{ alignItems: 'center' }}>
              <View style={[s.method, method === m.id && s.methodActive]}><Text style={{ fontSize: 28 }}>{m.emoji}</Text></View>
              <Text style={s.methodLabel}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.card}>
          {method === 'cash' ? (
            <>
              <Text style={{ fontSize: 56 }}>💵</Text>
              <Text style={s.cardTitle}>Pay with cash on delivery</Text>
              <Text style={s.cardText}>Prepare the exact amount for the courier.</Text>
            </>
          ) : card ? (
            <>
              <Text style={{ fontSize: 56 }}>💳</Text>
              <Text style={s.cardTitle}>{card.brand} •••• {card.last4}</Text>
              <Text style={s.cardText}>{card.holder}</Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 56 }}>💳</Text>
              <Text style={s.cardTitle}>No card added</Text>
              <Text style={s.cardText}>You can add a card and save it for later.</Text>
            </>
          )}
        </View>
        <Pressable style={s.addNew} onPress={() => navigation.navigate('AddCard')}>
          <Text style={s.addNewText}>+ {card ? 'REPLACE CARD' : 'ADD NEW'}</Text>
        </Pressable>
        {!!error && <Text style={s.error}>{error}</Text>}
      </View>
      <View style={s.footer}>
        <Text style={s.small}>TOTAL: <Text style={s.total}>${total.toFixed(2)}</Text></Text>
        <Button title="Pay & confirm" onPress={pay} style={{ marginTop: 16 }} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, padding: 20 },
  methods: { flexDirection: 'row', justifyContent: 'space-between' },
  method: { width: 90, height: 80, borderRadius: radius.md, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  methodActive: { borderColor: colors.primary, backgroundColor: colors.white },
  methodLabel: { marginTop: 6, fontSize: 12, color: colors.muted },
  card: { marginTop: 24, backgroundColor: colors.field, borderRadius: radius.lg, padding: 28, alignItems: 'center' },
  cardTitle: { fontWeight: '700', color: colors.text, marginTop: 10 },
  cardText: { color: colors.muted, textAlign: 'center', marginTop: 6 },
  addNew: { marginTop: 14, height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  addNewText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  error: { color: colors.danger, marginTop: 14 },
  footer: { padding: 20 },
  small: { color: colors.muted, fontSize: 12 },
  total: { fontSize: 28, fontWeight: '800', color: colors.text },
});
