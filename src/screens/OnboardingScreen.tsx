import React, { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { colors } from '../theme';
import { RootStackParamList } from '../navigation/types';

const slides = [
  { emoji: '🍔', title: 'All your favorites', text: 'Get all your loved foods in one once place, you just place the order we do the rest' },
  { emoji: '👨‍🍳', title: 'Order from chosen chef', text: 'Get all your loved foods in one once place, you just place the order we do the rest' },
  { emoji: '🛵', title: 'Free delivery offers', text: 'Get all your loved foods in one once place, you just place the order we do the rest' },
];

export default function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  const last = index === slides.length - 1;

  const next = () => {
    if (last) return navigation.replace('Login');
    ref.current?.scrollToIndex({ index: index + 1 });
  };

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[s.slide, { width }]}>
            <View style={s.illustration}>
              <Text style={{ fontSize: 120 }}>{item.emoji}</Text>
            </View>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={s.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[s.dot, i === index && s.dotActive]} />
        ))}
      </View>
      <View style={s.footer}>
        <Button title={last ? 'Get started' : 'Next'} onPress={next} />
        {!last && (
          <Pressable onPress={() => navigation.replace('Login')} style={{ marginTop: 18, alignItems: 'center' }}>
            <Text style={{ color: colors.text }}>Skip</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  slide: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 40 },
  illustration: { width: 260, height: 260, borderRadius: 130, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark, textAlign: 'center' },
  text: { fontSize: 16, color: colors.muted, textAlign: 'center', marginTop: 12, lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 20 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFD3BA' },
  dotActive: { backgroundColor: colors.primary },
  footer: { paddingHorizontal: 24, paddingBottom: 24 },
});
