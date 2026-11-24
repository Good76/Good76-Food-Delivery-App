import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { colors, radius } from '../theme';
import { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Profile'>, NativeStackScreenProps<RootStackParamList>>;
type Icon = React.ComponentProps<typeof Ionicons>['name'];

const groups: { icon: Icon; label: string }[][] = [
  [{ icon: 'person-outline', label: 'Personal Info' }, { icon: 'map-outline', label: 'Addresses' }],
  [{ icon: 'bag-outline', label: 'Cart' }, { icon: 'heart-outline', label: 'Favourite' }, { icon: 'notifications-outline', label: 'Notifications' }, { icon: 'card-outline', label: 'Payment Method' }],
  [{ icon: 'help-circle-outline', label: 'FAQs' }, { icon: 'star-outline', label: 'User Reviews' }, { icon: 'settings-outline', label: 'Settings' }],
];

export default function ProfileScreen({ navigation }: Props) {
  const { user } = useUser();
  const go = (label: string) => {
    if (label === 'Personal Info') navigation.navigate('EditProfile');
    else if (label === 'Addresses') navigation.navigate('Addresses');
    else if (label === 'Cart') navigation.navigate('Cart');
    else if (label === 'Payment Method') navigation.navigate('AddCard');
  };
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.profile}>
          <View style={s.avatar}><Text style={{ fontSize: 40 }}>🧑</Text></View>
          <View style={{ marginLeft: 16 }}>
            <Text style={s.name}>{user.name}</Text>
            <Text style={s.bio}>{user.bio}</Text>
          </View>
        </View>

        {groups.map((g, gi) => (
          <View key={gi} style={s.group}>
            {g.map((item) => (
              <Pressable key={item.label} style={s.item} onPress={() => go(item.label)}>
                <View style={s.iconWrap}><Ionicons name={item.icon} size={18} color={colors.primary} /></View>
                <Text style={s.label}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        ))}

        <View style={s.group}>
          <Pressable style={s.item} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }))}>
            <View style={[s.iconWrap, { backgroundColor: '#FFEBE4' }]}><Ionicons name="log-out-outline" size={18} color={colors.danger} /></View>
            <Text style={s.label}>Log Out</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  profile: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  bio: { color: colors.muted, marginTop: 4 },
  group: { backgroundColor: colors.field, borderRadius: radius.lg, paddingHorizontal: 16, marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, marginLeft: 14, color: colors.text, fontSize: 15 },
});
