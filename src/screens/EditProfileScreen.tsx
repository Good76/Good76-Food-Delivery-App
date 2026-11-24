import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function EditProfileScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'EditProfile'>) {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!name.trim()) return setError('Имя не может быть пустым');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Введите корректный email');
    setError('');
    updateUser({ name: name.trim(), email, phone, bio });
    setSaved(true);
    setTimeout(() => navigation.goBack(), 700);
  };

  return (
    <SafeAreaView style={s.safe}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <View style={s.avatarWrap}>
            <View style={s.avatar}><Text style={{ fontSize: 56 }}>🧑</Text></View>
            <View style={s.pencil}><Ionicons name="pencil" size={14} color={colors.white} /></View>
          </View>
          <Text style={s.label}>FULL NAME</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} />
          <Text style={s.label}>EMAIL</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Text style={s.label}>PHONE NUMBER</Text>
          <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Text style={s.label}>BIO</Text>
          <TextInput style={[s.input, { height: 100, paddingTop: 16, textAlignVertical: 'top' }]} value={bio} onChangeText={setBio} multiline />
          {!!error && <Text style={s.error}>{error}</Text>}
          {saved && <Text style={s.ok}>Saved ✓</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ padding: 20 }}><Button title="Save" onPress={save} /></View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  avatarWrap: { alignSelf: 'center', marginBottom: 8 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  pencil: { position: 'absolute', right: 0, bottom: 4, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, color: colors.muted, marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: colors.field, borderRadius: radius.md, height: 56, paddingHorizontal: 18, fontSize: 14, color: colors.text },
  error: { color: colors.danger, marginTop: 14 },
  ok: { color: colors.success, marginTop: 14, fontWeight: '700' },
});
