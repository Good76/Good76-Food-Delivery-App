import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { courier } from '../data/mockData';
import { colors, radius } from '../theme';
import { RootStackParamList } from '../navigation/types';

// Маршрут в долях от размеров карты (только горизонтальные/вертикальные отрезки)
const route: [number, number][] = [[0.18, 0.88], [0.18, 0.55], [0.55, 0.55], [0.55, 0.28], [0.82, 0.28]];
const parks = [
  { l: 0.3, t: 0.62, w: 0.35, h: 0.2 },
  { l: 0.62, t: 0.36, w: 0.28, h: 0.14 },
  { l: 0.05, t: 0.1, w: 0.3, h: 0.22 },
];

export default function TrackOrderScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'TrackOrder'>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const pts = useMemo(() => route.map(([x, y]) => ({ x: x * size.w, y: y * size.h })), [size]);

  const { segments, inputRange, xs, ys } = useMemo(() => {
    const lens = pts.slice(1).map((p, i) => Math.abs(p.x - pts[i].x) + Math.abs(p.y - pts[i].y));
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const input = [0];
    lens.forEach((l) => { acc += l; input.push(acc / total); });
    return { segments: lens, inputRange: input, xs: pts.map((p) => p.x), ys: pts.map((p) => p.y) };
  }, [pts]);

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const ready = size.w > 0 && segments.length > 0;

  return (
    <View style={s.root}>
      <View style={s.map} onLayout={onLayout}>
        {ready && parks.map((p, i) => (
          <View key={i} style={[s.park, { left: p.l * size.w, top: p.t * size.h, width: p.w * size.w, height: p.h * size.h }]} />
        ))}
        {ready && pts.slice(1).map((p, i) => {
          const a = pts[i];
          const horizontal = a.y === p.y;
          return (
            <View
              key={i}
              style={[
                s.line,
                horizontal
                  ? { left: Math.min(a.x, p.x), top: a.y - 2, width: Math.abs(p.x - a.x) + 4, height: 4 }
                  : { left: a.x - 2, top: Math.min(a.y, p.y), width: 4, height: Math.abs(p.y - a.y) + 4 },
              ]}
            />
          );
        })}
        {ready && (
          <>
            <Text style={[s.pin, { left: pts[pts.length - 1].x - 16, top: pts[pts.length - 1].y - 34 }]}>📍</Text>
            <Animated.Text
              style={[
                s.scooter,
                {
                  transform: [
                    { translateX: Animated.add(progress.interpolate({ inputRange, outputRange: xs }), new Animated.Value(-16)) },
                    { translateY: Animated.add(progress.interpolate({ inputRange, outputRange: ys }), new Animated.Value(-16)) },
                  ],
                },
              ]}
            >
              🛵
            </Animated.Text>
          </>
        )}
      </View>

      <SafeAreaView style={s.backWrap} edges={['top']}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Ionicons name="chevron-back" size={20} color={colors.text} /></Pressable>
        <Text style={s.title}>Track Order</Text>
      </SafeAreaView>

      <SafeAreaView style={s.sheet} edges={['bottom']}>
        <View style={s.handle} />
        <View style={s.row}>
          <View style={s.thumb}><Text style={{ fontSize: 28 }}>☕</Text></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.name}>Uttora Coffee House</Text>
            <Text style={s.sub}>Ordered at 06 Sept, 10:00pm</Text>
            <Text style={s.sub}>2x Burger · 4x Sandwich</Text>
          </View>
          <View style={s.eta}><Text style={s.etaText}>~14 min</Text></View>
        </View>
        <View style={s.divider} />
        <View style={s.row}>
          <View style={s.avatar}><Text style={{ fontSize: 26 }}>{courier.emoji}</Text></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.name}>{courier.name}</Text>
            <Text style={s.sub}>Your courier</Text>
          </View>
          <Pressable style={[s.action, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('Call')}>
            <Ionicons name="call" size={18} color={colors.white} />
          </Pressable>
          <Pressable style={[s.action, { backgroundColor: colors.dark, marginLeft: 10 }]} onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF6EA' },
  map: { ...StyleSheet.absoluteFillObject },
  park: { position: 'absolute', backgroundColor: '#CFE8C5', borderRadius: 18 },
  line: { position: 'absolute', backgroundColor: colors.primary, borderRadius: 2 },
  pin: { position: 'absolute', fontSize: 32 },
  scooter: { position: 'absolute', left: 0, top: 0, fontSize: 30 },
  backWrap: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 10 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: 20, paddingBottom: 12 },
  handle: { alignSelf: 'center', width: 48, height: 5, borderRadius: 3, backgroundColor: colors.border, marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  thumb: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '700', color: colors.text },
  sub: { color: colors.muted, fontSize: 12, marginTop: 3 },
  eta: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  etaText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  action: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
