import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { courier } from '../data/mockData';
import { colors } from '../theme';
import { RootStackParamList } from '../navigation/types';

const pad = (n: number) => String(n).padStart(2, '0');

export default function CallScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Call'>) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!connected) return;
    const i = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(i);
  }, [connected]);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <View style={s.avatar}><Text style={{ fontSize: 80 }}>{courier.emoji}</Text></View>
        <Text style={s.name}>{courier.name}</Text>
        <Text style={s.status}>{connected ? `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}` : 'Connecting......'}</Text>
      </View>
      <View style={s.controls}>
        <Pressable onPress={() => setMuted(!muted)} style={[s.btn, muted && s.btnOn]}>
          <Ionicons name={muted ? 'mic-off' : 'mic'} size={22} color={colors.white} />
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={[s.btn, s.end]}>
          <Ionicons name="call" size={28} color={colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
        </Pressable>
        <Pressable onPress={() => setSpeaker(!speaker)} style={[s.btn, speaker && s.btnOn]}>
          <Ionicons name="volume-high" size={22} color={colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.dark },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.white, fontSize: 24, fontWeight: '800', marginTop: 24 },
  status: { color: colors.muted, marginTop: 8, fontSize: 16 },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 48 },
  btn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.darkSoft, alignItems: 'center', justifyContent: 'center' },
  btnOn: { backgroundColor: colors.primary },
  end: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.danger },
});
