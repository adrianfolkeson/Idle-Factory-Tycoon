import React from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS } from '../../constants/colors'
import { DAILY_REWARDS } from '../../lib/gameEngine'
import { useGame } from '../../context/GameContext'
import PixelIcon from '../ui/PixelIcon'

interface Props {
  onClose: () => void
}

const DAY_ICONS = ['box', 'bolt', 'coin', 'fire', 'coin', 'star', 'trophy']

export default function DailyRewardModal({ onClose }: Props) {
  const { state, claimDailyReward } = useGame()
  const currentDay = state.dailyReward.streak % DAILY_REWARDS.length
  const reward = DAILY_REWARDS[currentDay]

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <PixelIcon name="gift" size={20} color={COLORS.gold} />
            <Text style={styles.title}>DAGLIG BELÖNING</Text>
          </View>
          <Text style={styles.streak}>{state.dailyReward.streak} dagars streak!</Text>

          <View style={styles.daysRow}>
            {DAILY_REWARDS.map((r, i) => {
              const isPast = i < currentDay
              const isCurrent = i === currentDay
              return (
                <View key={i} style={[styles.dayBox, isPast && styles.dayPast, isCurrent && styles.dayCurrent]}>
                  <PixelIcon name={DAY_ICONS[i]} size={18} color={isCurrent ? COLORS.gold : isPast ? COLORS.green : '#555'} />
                  <Text style={styles.dayNum}>Dag {i + 1}</Text>
                  <Text style={styles.dayReward}>{r.label}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.todayBox}>
            <Text style={styles.todayLabel}>DAGENS BELÖNING</Text>
            <Text style={styles.todayReward}>{reward.label}</Text>
          </View>

          <TouchableOpacity style={styles.claimButton} onPress={claimDailyReward}>
            <Text style={styles.claimText}>HÄMTA!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.later}>Senare...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 3,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 20,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  streak: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dayBox: {
    width: 76,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  dayPast: {
    borderColor: COLORS.green,
    opacity: 0.6,
  },
  dayCurrent: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    backgroundColor: '#2A2000',
  },
  dayIconWrap: { marginBottom: 4, alignItems: 'center' },
  dayNum: { fontSize: 9, fontFamily: 'Courier New', color: COLORS.grey },
  dayReward: { fontSize: 9, fontFamily: 'Courier New', color: COLORS.white, textAlign: 'center' },
  todayBox: {
    backgroundColor: '#1A1400',
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  todayLabel: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginBottom: 4,
  },
  todayReward: {
    fontSize: 24,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.goldLight,
  },
  claimButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#8B6000',
    marginBottom: 12,
  },
  claimText: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 2,
  },
  later: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.greyDark,
  },
})
