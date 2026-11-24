import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

const formatNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function AddCardScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AddCard'>) {
  const { saveCard } = useCart();
  const { user } = useUser();
  const [holder, setHolder] = useState(user.name);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const digits = number.replace(/\s/g, '');
    const month = Number(expiry.slice(0, 2));
    if (!holder.trim()) return setError('Введите имя владельца карты');
    if (digits.length !== 16) return setError('Номер карты должен содержать 16 цифр');
    if (expiry.length !== 5 || month < 1 || month > 12) return setError('Срок действия в формате MM/YY');
    if (cvc.length !== 3) return setError('CVC — 3 цифры');
    saveCard({ brand: digits.startsWith('4') ? 'Visa' : 'Mastercard', last4: digits.slice(-4), holder: holder.trim() });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.safe}>
      <Header title="Add Card" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>CARD HOLDER NAME</Text>
          <TextInput style={s.input} value={holder} onChangeText={setHolder} placeholder="Vishal Khadok" placeholderTextColor={colors.muted} />
          <Text style={s.label}>CARD NUMBER</Text>
          <TextInput style={s.input} value={number} onChangeText={(v) => setNumber(formatNumber(v))} keyboardType="number-pad" placeholder="2134 ____ ____ ____" placeholderTextColor={colors.muted} />
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>EXPIRE DATE</Text>
              <TextInput style={s.input} value={expiry} onChangeText={(v) => setExpiry(formatExpiry(v))} keyboardType="number-pad" placeholder="mm/yy" placeholderTextColor={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>CVC</Text>
              <TextInput style={s.input} value={cvc} onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 3))} keyboardType="number-pad" secureTextEntry placeholder="•••" placeholderTextColor={colors.muted} />
            </View>
          </View>
          {!!error && <Text style={s.error}>{error}</Text>}
          <Text style={s.note}>Демо-экран: данные карты не отправляются и хранятся только в памяти приложения.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ padding: 20 }}><Button title="Save card" onPress={submit} /></View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  label: { fontSize: 12, color: colors.muted, marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: colors.field, borderRadius: radius.md, height: 56, paddingHorizontal: 18, fontSize: 14, color: colors.text },
  error: { color: colors.danger, marginTop: 14 },
  note: { color: colors.muted, fontSize: 12, marginTop: 20 },
});
