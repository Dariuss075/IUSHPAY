// src/screens/DashboardScreen.tsx
// Vista del estudiante — muestra el QR de acceso.

import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import QRDisplay from '../components/QRDisplay';
import { useSessionStore } from '../store/useSessionStore';
import { colors, spacing, fontSize, radius } from '../theme';

export default function DashboardScreen() {
  const { userId, userName } = useSessionStore();

  if (!userId) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <View>
            <Text style={styles.appName}>IUSHPAY</Text>
            <Text style={styles.appSub}>Campus Access · Parqueadero</Text>
          </View>
        </View>

        {/* Saludo */}
        <Text style={styles.greeting}>Hola, {userName?.split(' ')[0]} 👋</Text>

        {/* QR */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>Tu QR de acceso</Text>
          <Text style={styles.sectionSub}>
            Muéstrale esta pantalla al vigilante
          </Text>
          <QRDisplay userId={userId} />
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🔒 El QR expira en 60 segundos y se regenera automáticamente.
            Es único e intransferible.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: '900',
  },
  appName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 2,
  },
  appSub: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  qrSection: {
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sectionSub: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bgCardBorder,
    padding: spacing.md,
    width: '100%',
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
