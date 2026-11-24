import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { Address } from '../types';

const labels: Address['label'][] = ['Home', 'Work', 'Other'];
const icon = { Home: 'home-outline', Work: 'briefcase-outline', Other: 'location-outline' } as const;

export default function AddressesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Addresses'>) {
  const { addresses, addAddress, removeAddress } = useUser();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState<Address['label']>('Home');
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [apartment, setApartment] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    if (!address.trim()) return setError('Введите адрес');
    addAddress({ label, address: address.trim(), street, postCode, apartment });
    setAddress(''); setStreet(''); setPostCode(''); setApartment(''); setError('');
    setAdding(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <Header title={adding ? 'Add Address' : 'My Address'} onBack={() => (adding ? setAdding(false) : navigation.goBack())} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          {!adding ? (
            <>
              {addresses.length === 0 && <Text style={{ color: colors.muted }}>No addresses yet. Add your first one below.</Text>}
              {addresses.map((a, i) => (
                <View key={a.id} style={s.card}>
                  <View style={s.iconWrap}><Ionicons name={icon[a.label]} size={20} color={colors.primary} /></View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={s.cardLabel}>{a.label.toUpperCase()}{i === 0 ? '  · default' : ''}</Text>
                    <Text style={s.cardAddress}>{a.address}</Text>
                  </View>
                  <Pressable onPress={() => removeAddress(a.id)} hitSlop={10}><Ionicons name="trash-outline" size={18} color={colors.danger} /></Pressable>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={s.label}>ADDRESS</Text>
              <TextInput style={s.input} value={address} onChangeText={setAddress} placeholder="3235 Royal Ln. Mesa, New Jersey 34567" placeholderTextColor={colors.muted} />
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>STREET</Text>
                  <TextInput style={s.input} value={street} onChangeText={setStreet} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>POST CODE</Text>
                  <TextInput style={s.input} value={postCode} onChangeText={setPostCode} keyboardType="number-pad" />
                </View>
              </View>
              <Text style={s.label}>APARTMENT</Text>
              <TextInput style={s.input} value={apartment} onChangeText={setApartment} />
              <Text style={s.label}>LABEL AS</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {labels.map((l) => (
                  <Pressable key={l} onPress={() => setLabel(l)} style={[s.chip, label === l && s.chipActive]}>
                    <Text style={[s.chipText, label === l && { color: colors.white }]}>{l}</Text>
                  </Pressable>
                ))}
              </View>
              {!!error && <Text style={s.error}>{error}</Text>}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ padding: 20 }}>
        <Button title={adding ? 'Save location' : 'Add new address'} onPress={adding ? save : () => setAdding(true)} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.field, borderRadius: radius.lg, padding: 16, marginBottom: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.text },
  cardAddress: { color: colors.muted, marginTop: 4, fontSize: 13 },
  label: { fontSize: 12, color: colors.muted, marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: colors.field, borderRadius: radius.md, height: 56, paddingHorizontal: 18, fontSize: 14, color: colors.text },
  chip: { paddingHorizontal: 20, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontWeight: '600', color: colors.text },
  error: { color: colors.danger, marginTop: 14 },
});
