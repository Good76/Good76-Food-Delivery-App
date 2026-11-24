import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Logo from '../components/Logo';
import { colors } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function SplashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 1600);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={s.root}>
      <Logo size={64} />
    </View>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' } });
