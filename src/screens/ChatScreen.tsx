import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { courier } from '../data/mockData';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Msg = { id: string; from: 'me' | 'courier'; text: string; time: string };

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const replies = ["I'm coming, just wait…", 'Got it, 5 more minutes!', 'On my way 🛵', 'Thanks for your patience!'];

export default function ChatScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', from: 'courier', text: 'Hey, congratulations for your order!', time: now() },
  ]);
  const [text, setText] = useState('');
  const list = useRef<FlatList<Msg>>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = () => {
    const v = text.trim();
    if (!v) return;
    setMessages((m) => [...m, { id: `${Date.now()}`, from: 'me', text: v, time: now() }]);
    setText('');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: `${Date.now()}c`, from: 'courier', text: replies[m.length % replies.length], time: now() }]);
    }, 1200);
  };

  return (
    <SafeAreaView style={s.safe}>
      <Header title={courier.name} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          ref={list} data={messages} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 20, gap: 14 }}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[s.msgRow, item.from === 'me' && { justifyContent: 'flex-end' }]}>
              {item.from === 'courier' && <View style={s.avatar}><Text>{courier.emoji}</Text></View>}
              <View>
                <View style={[s.bubble, item.from === 'me' ? s.me : s.them]}>
                  <Text style={{ color: item.from === 'me' ? colors.white : colors.text }}>{item.text}</Text>
                </View>
                <Text style={[s.time, item.from === 'me' && { textAlign: 'right' }]}>{item.time}</Text>
              </View>
            </View>
          )}
        />
        <View style={s.inputRow}>
          <TextInput style={s.input} placeholder="Write something…" placeholderTextColor={colors.muted} value={text} onChangeText={setText} onSubmitEditing={send} returnKeyType="send" />
          <Pressable onPress={send} style={s.send}><Ionicons name="send" size={18} color={colors.white} /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: 260, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  me: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  them: { backgroundColor: colors.field, borderBottomLeftRadius: 4 },
  time: { fontSize: 11, color: colors.muted, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  input: { flex: 1, height: 52, borderRadius: radius.md, backgroundColor: colors.field, paddingHorizontal: 16, color: colors.text },
  send: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
