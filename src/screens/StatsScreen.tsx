import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useGame } from '../context/GameContext'
import { ACHIEVEMENTS } from '../constants/achievements'
import { COLORS } from '../constants/colors'
import PixelIcon from '../components/ui/PixelIcon'
import { formatMoney, formatTime, formatNumber } from '../lib/formatting'
import { PRESTIGE_THRESHOLD } from '../lib/gameEngine'

export default function StatsScreen() {
  const { state, resetGame, setShowDailyReward, canPrestige, prestige } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    Alert.alert(
      'Återställ spel?',
      'All progress raderas. Är du säker?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ja, återställ!',
          style: 'destructive',
          onPress: () => resetGame(),
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PixelIcon name="coin" size={13} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>STATISTIK</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatBox label="Totalt tjänat" value={formatMoney(state.totalEarned)} />
          <StatBox label="Tid spelad" value={formatTime(state.stats.totalTimePlayed)} />
          <StatBox label="Totala klick" value={formatNumber(state.stats.totalTaps)} />
          <StatBox label="Uppgraderingar" value={formatNumber(state.stats.totalUpgradesPurchased)} />
          <StatBox label="Skugga-besök" value={`${state.stats.skuggaSightings}x`} />
          <StatBox label="Kombos" value={`${state.stats.combosActivated}x`} />
          <StatBox label="Dagars streak" value={`${state.dailyReward.streak} dagar`} />
          <StatBox label="Achievements" value={`${state.unlockedAchievements.length}/${ACHIEVEMENTS.length}`} />
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PixelIcon name="trophy" size={13} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        </View>
        <View style={styles.achGrid}>
          {ACHIEVEMENTS.map(ach => {
            const unlocked = state.unlockedAchievements.includes(ach.id)
            return (
              <View key={ach.id} style={[styles.achCard, unlocked ? styles.achUnlocked : styles.achLocked]}>
                <View style={[styles.achIconWrap, !unlocked && styles.achIconLocked]}>
                  <PixelIcon name={ach.icon} size={20} color={unlocked ? COLORS.gold : '#333'} />
                </View>
                <Text style={[styles.achName, !unlocked && styles.achNameLocked]}>{ach.name}</Text>
                <Text style={[styles.achDesc, !unlocked && styles.achDescLocked]}>{ach.description}</Text>
                {unlocked && (
                  <View style={styles.achDone}>
                    <PixelIcon name="check" size={10} color={COLORS.gold} />
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </View>

      {/* Prestige */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PixelIcon name="crown" size={13} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>PRESTIGE</Text>
        </View>
        {state.prestige > 0 && (
          <View style={styles.prestigeBadge}>
            <PixelIcon name="star" size={12} color={COLORS.gold} />
            <Text style={styles.prestigeCount}>Prestige {state.prestige} — {Math.round((state.prestigeMultiplier - 1) * 100)}% produktionsbonus</Text>
          </View>
        )}
        {canPrestige ? (
          <TouchableOpacity
            style={styles.prestigeBtn}
            onPress={() => {
              Alert.alert(
                'Prestige?',
                `Återställ framsteg och få +35% permanent produktionsbonus.\nNuvarande: ${state.prestige > 0 ? Math.round((state.prestigeMultiplier - 1) * 100) + '%' : '0%'} → ${Math.round(((state.prestige ?? 0) + 1) * 35)}%`,
                [
                  { text: 'Avbryt', style: 'cancel' },
                  { text: 'PRESTIGE!', style: 'destructive', onPress: prestige },
                ]
              )
            }}
            activeOpacity={0.8}
          >
            <PixelIcon name="crown" size={14} color="#000" />
            <Text style={styles.prestigeBtnText}>PRESTIGE — ÅTERSTÄLL MED BONUS</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.prestigeLocked}>
            <Text style={styles.prestigeLockedText}>Lås upp: tjäna totalt {formatMoney(PRESTIGE_THRESHOLD)}</Text>
            <View style={styles.prestigeBar}>
              <View style={[styles.prestigeBarFill, { width: `${Math.min(100, (state.totalEarned / PRESTIGE_THRESHOLD) * 100)}%` as any }]} />
            </View>
          </View>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PixelIcon name="gear" size={13} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>INSTÄLLNINGAR</Text>
        </View>

        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => setShowDailyReward(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <PixelIcon name="gift" size={13} color={COLORS.white} />
            <Text style={styles.settingText}>Daglig belöning</Text>
          </View>
          <PixelIcon name="bolt" size={10} color={COLORS.grey} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingBtn, styles.dangerBtn]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <PixelIcon name="trash" size={13} color={COLORS.redLight} />
            <Text style={[styles.settingText, styles.dangerText]}>Återställ spel</Text>
          </View>
          <PixelIcon name="warning" size={10} color={COLORS.redLight} />
        </TouchableOpacity>

        <Text style={styles.version}>Idle Factory Tycoon v1.0.0</Text>
        <Text style={styles.version}>av Bosse & BUSSE</Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 12 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 10,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
  },
  achGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    position: 'relative',
  },
  achUnlocked: {
    backgroundColor: '#1A1A00',
    borderColor: COLORS.gold,
  },
  achLocked: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  achIconWrap: { marginBottom: 4 },
  achIconLocked: { opacity: 0.3 },
  achName: {
    fontSize: 11,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 2,
  },
  achNameLocked: { color: COLORS.greyDark },
  achDesc: {
    fontSize: 9,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    lineHeight: 13,
  },
  achDescLocked: { color: COLORS.greyDark },
  achDone: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  settingBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerBtn: {
    borderColor: COLORS.red,
    backgroundColor: '#1A0000',
  },
  settingText: {
    fontSize: 13,
    fontFamily: 'Courier New',
    color: COLORS.white,
  },
  dangerText: { color: COLORS.redLight },
  settingArrow: {
    fontSize: 18,
    color: COLORS.grey,
  },
  version: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.greyDark,
    textAlign: 'center',
    marginTop: 4,
  },
  prestigeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1400',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  prestigeCount: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  prestigeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.gold,
    paddingVertical: 14,
    borderRadius: 6,
    borderBottomWidth: 4,
    borderColor: '#8B6000',
  },
  prestigeBtnText: {
    fontSize: 13,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  prestigeLocked: {
    gap: 8,
  },
  prestigeLockedText: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.greyDark,
    textAlign: 'center',
  },
  prestigeBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  prestigeBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
})
