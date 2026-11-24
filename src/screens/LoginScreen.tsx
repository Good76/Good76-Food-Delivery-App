import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Введите корректный email');
    if (password.length < 6) return setError('Пароль — минимум 6 символов');
    if (mode === 'signup' && !name.trim()) return setError('Введите имя');
    setError('');
    navigation.replace('Main');
  };

  const isLogin = mode === 'login';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.hero}>
          <Text style={s.heroTitle}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
          <Text style={s.heroSub}>{isLogin ? 'Please sign in to your existing account' : 'Please sign up to get started'}</Text>
        </View>
        <ScrollView style={s.sheet} contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          {!isLogin && (
            <>
              <Text style={s.label}>NAME</Text>
              <TextInput style={s.input} placeholder="John Doe" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
            </>
          )}
          <Text style={s.label}>EMAIL</Text>
          <TextInput style={s.input} placeholder="example@gmail.com" placeholderTextColor={colors.muted}
            autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Text style={s.label}>PASSWORD</Text>
          <View style={[s.input, { flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput style={{ flex: 1, fontSize: 14 }} placeholder="• • • • • • • •" placeholderTextColor={colors.muted}
              secureTextEntry={!show} value={password} onChangeText={setPassword} />
            <Pressable onPress={() => setShow(!show)}>
              <Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
            </Pressable>
          </View>
          {!!error && <Text style={s.error}>{error}</Text>}
          <View style={{ height: 24 }} />
          <Button title={isLogin ? 'Log in' : 'Sign up'} onPress={submit} />
          <Pressable onPress={() => setMode(isLogin ? 'signup' : 'login')} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: colors.muted }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{isLogin ? 'SIGN UP' : 'LOG IN'}</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.dark },
  hero: { height: 190, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.white, fontSize: 30, fontWeight: '800' },
  heroSub: { color: colors.white, fontSize: 14, marginTop: 8, opacity: 0.85 },
  sheet: { flex: 1, backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  label: { fontSize: 13, color: colors.text, marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: colors.field, borderRadius: radius.md, height: 56, paddingHorizontal: 18, fontSize: 14, color: colors.text },
  error: { color: colors.danger, marginTop: 12 },
});
