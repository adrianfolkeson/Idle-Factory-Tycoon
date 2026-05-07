import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert, Modal } from 'react-native'
import { useGame } from '../context/GameContext'
import { COLORS } from '../constants/colors'
import PixelIcon from '../components/ui/PixelIcon'
import { soundManager } from '../lib/soundManager'

interface Props {
  onOpenPrivacy?: () => void
}

export default function SettingsScreen({ onOpenPrivacy }: Props) {
  const {
    state, resetGame, setShowDailyReward,
    adsRemoved, buyRemoveAds, buyStarterPack, restoreIAP,
    devUnlockAll,
  } = useGame()

  const [soundOn, setSoundOn] = useState(true)

  const toggleSound = (val: boolean) => {
    setSoundOn(val)
    soundManager.setEnabled(val)
  }

  const handleReset = () => {
    Alert.alert(
      'Återställ spel?',
      'All progress raderas permanent. Säker?',
      [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Ja, återställ!', style: 'destructive', onPress: () => resetGame() },
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* ── Sound & display ── */}
      <Text style={styles.section}>LJUD & VISNING</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <PixelIcon name="gear" size={14} color={COLORS.gold} />
            <Text style={styles.rowLabel}>Ljudeffekter</Text>
          </View>
          <Switch
            value={soundOn}
            onValueChange={toggleSound}
            trackColor={{ false: COLORS.border, true: COLORS.greenLight }}
            thumbColor={soundOn ? COLORS.gold : COLORS.greyDark}
          />
        </View>
      </View>

      {/* ── IAP / Remove ads ── */}
      <Text style={styles.section}>KÖP</Text>
      <View style={styles.card}>
        {!adsRemoved ? (
          <TouchableOpacity style={[styles.row, styles.rowBtn]} onPress={() => buyRemoveAds()}>
            <View style={styles.rowLeft}>
              <PixelIcon name="star" size={14} color={COLORS.gold} />
              <View>
                <Text style={styles.rowLabel}>Ta bort annonser</Text>
                <Text style={styles.rowSub}>Engångsköp · $2.99</Text>
              </View>
            </View>
            <PixelIcon name="bolt" size={10} color={COLORS.gold} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.row, { borderColor: COLORS.greenLight }]}>
            <View style={styles.rowLeft}>
              <PixelIcon name="check" size={14} color={COLORS.greenLight} />
              <Text style={[styles.rowLabel, { color: COLORS.greenLight }]}>Annonser borttagna</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <TouchableOpacity style={[styles.row, styles.rowBtn]}
          onPress={() => buyStarterPack(() => {})}>
          <View style={styles.rowLeft}>
            <PixelIcon name="gift" size={14} color="#AA44FF" />
            <View>
              <Text style={styles.rowLabel}>Startpaket</Text>
              <Text style={styles.rowSub}>$10K + 2x boost 1h · $0.99</Text>
            </View>
          </View>
          <PixelIcon name="bolt" size={10} color="#AA44FF" />
        </TouchableOpacity>

      </View>

      {/* ── Game ── */}
      <Text style={styles.section}>SPEL</Text>
      <View style={styles.card}>
        <TouchableOpacity style={[styles.row, styles.rowBtn]}
          onPress={() => setShowDailyReward(true)}>
          <View style={styles.rowLeft}>
            <PixelIcon name="gift" size={14} color={COLORS.gold} />
            <Text style={styles.rowLabel}>Daglig belöning</Text>
          </View>
          <PixelIcon name="bolt" size={10} color={COLORS.grey} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {onOpenPrivacy && (
          <>
            <TouchableOpacity style={[styles.row, styles.rowBtn]} onPress={onOpenPrivacy}>
              <View style={styles.rowLeft}>
                <PixelIcon name="warning" size={14} color={COLORS.grey} />
                <Text style={styles.rowLabel}>Integritetspolicy</Text>
              </View>
              <PixelIcon name="bolt" size={10} color={COLORS.grey} />
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}

        <TouchableOpacity style={[styles.row, styles.rowBtn, { borderColor: COLORS.red }]}
          onPress={handleReset}>
          <View style={styles.rowLeft}>
            <PixelIcon name="trash" size={14} color={COLORS.redLight} />
            <Text style={[styles.rowLabel, { color: COLORS.redLight }]}>Återställ spel</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── About ── */}
      <Text style={styles.about}>Idle Factory Tycoon v1.0.0</Text>
      <Text style={styles.about}>av Bosse & BUSSE</Text>
      <View style={{ height: 24 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, gap: 8 },
  section: {
    fontSize: 11,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.greyDark,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowBtn: { activeOpacity: 0.7 } as any,
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: {
    fontSize: 13,
    fontFamily: 'Courier New',
    color: COLORS.white,
  },
  rowSub: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginTop: 1,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  about: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.greyDark,
    textAlign: 'center',
    marginTop: 4,
  },
})
