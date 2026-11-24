import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

type Props = { visible: boolean; onClose: () => void };

export default function OfferModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.wrap}>
          <Pressable onPress={onClose} style={s.close} hitSlop={10}>
            <Ionicons name="close" size={16} color={colors.dark} />
          </Pressable>
          <View style={s.card}>
            <Text style={s.title}>Hurry Offers!</Text>
            <Text style={s.code}>#1243CD2</Text>
            <Text style={s.text}>Use the coupon and get 25% discount</Text>
            <Pressable onPress={onClose} style={s.btn}>
              <Text style={s.btnText}>GOT IT</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(24,28,46,0.65)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  wrap: { width: '100%', maxWidth: 380 },
  close: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFE082', alignItems: 'center', justifyContent: 'center', marginBottom: -10, zIndex: 2 },
  card: { backgroundColor: '#FFA726', borderRadius: radius.xl, padding: 28, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: colors.white },
  code: { fontSize: 24, fontWeight: '800', color: colors.white, marginTop: 20, letterSpacing: 1 },
  text: { color: colors.white, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  btn: { marginTop: 26, alignSelf: 'stretch', height: 52, borderRadius: radius.md, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.white, fontWeight: '800', letterSpacing: 0.5 },
});
