import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS } from '../constants/colors'

interface Props {
  onClose: () => void
}

export default function PrivacyPolicyScreen({ onClose }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INTEGRITETSPOLICY</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>STÄNG</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Senast uppdaterad: 2026-05-04</Text>

        <Text style={styles.section}>1. INFORMATION VI SAMLAR IN</Text>
        <Text style={styles.body}>
          Idle Factory Tycoon samlar in minimal information för att fungera. Vi samlar in:
          {'\n\n'}• Speldata (poäng, uppgraderingar, framsteg) — lagras lokalt på din enhet.
          {'\n'}• Reklaminformation — vi använder Google AdMob för annonser, som kan samla in enhetsidentifierare för att visa relevanta annonser.
          {'\n'}• Kraschrapporter — via Sentry för att förbättra appens stabilitet.
        </Text>

        <Text style={styles.section}>2. HUR VI ANVÄNDER INFORMATION</Text>
        <Text style={styles.body}>
          Din speldata används enbart för att köra spelet. Vi säljer aldrig personlig information till tredje part.
          Reklamdata används av Google AdMob enligt deras integritetspolicy.
        </Text>

        <Text style={styles.section}>3. TREDJEPARTSTJÄNSTER</Text>
        <Text style={styles.body}>
          • Google AdMob: annonsvisning. Se Googles integritetspolicy på policies.google.com{'\n'}
          • Sentry: kraschrapportering. Se sentry.io/privacy
        </Text>

        <Text style={styles.section}>4. BARN</Text>
        <Text style={styles.body}>
          Appen är lämplig för alla åldrar (4+). Vi samlar inte medvetet in personlig information från barn under 13 år.
        </Text>

        <Text style={styles.section}>5. KONTAKT</Text>
        <Text style={styles.body}>
          Frågor om integritet? Kontakta oss på: privacy@idlefactorytycoon.com
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#111',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 14, fontFamily: 'Courier New', fontWeight: 'bold', color: COLORS.gold, letterSpacing: 2 },
  closeBtn: { padding: 6 },
  closeText: { fontSize: 11, fontFamily: 'Courier New', color: COLORS.grey },
  content: { padding: 16 },
  updated: { fontSize: 10, fontFamily: 'Courier New', color: COLORS.greyDark, marginBottom: 20 },
  section: {
    fontSize: 13,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 1,
  },
  body: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: COLORS.offWhite,
    lineHeight: 20,
  },
})
