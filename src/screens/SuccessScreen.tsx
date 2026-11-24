import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { colors } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function SuccessScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Success'>) {
  const { clear } = useCart();
  useEffect(() => clear(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <Text style={{ fontSize: 96 }}>🎉</Text>
        <Text style={s.title}>Congratulations!</Text>
        <Text style={s.text}>You successfully made a payment, enjoy our service!</Text>
      </View>
      <View style={{ padding: 24 }}>
        <Button
          title="Track order"
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({ index: 1, routes: [{ name: 'Main', params: { screen: 'Orders' } }, { name: 'TrackOrder' }] }),
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark, marginTop: 16 },
  text: { color: colors.muted, textAlign: 'center', marginTop: 8 },
});
