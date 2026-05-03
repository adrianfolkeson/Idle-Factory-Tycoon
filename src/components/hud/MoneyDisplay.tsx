import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useGame } from '../../context/GameContext'
import { formatMoney, formatRate } from '../../lib/formatting'
import { s } from '../../lib/i18n'
import { COLORS } from '../../constants/colors'
import { WORLDS } from '../../constants/worlds'
import PixelIcon from '../ui/PixelIcon'

function secsLeft(expiresAt: number, now: number): number {
  return Math.max(0, Math.ceil((expiresAt - now) / 1000))
}

export default function MoneyDisplay() {
  const { state, productionRate } = useGame()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const world = WORLDS[state.currentWorldId]
  const comboBoost  = state.activeBoosts.find(b => b.id === 'combo' && b.expiresAt > now)
  const skuggaBoost = state.activeBoosts.find(b => b.id === 'skugga' && b.expiresAt > now)
  const dailyBoost  = state.activeBoosts.find(b => b.id.startsWith('daily') && b.expiresAt > now)

  const accent = world?.theme.accent ?? COLORS.gold
  const isIdle = productionRate === 0

  return (
    <View style={[styles.container, { borderBottomColor: accent }]}>
      <View style={styles.topRow}>
        <Text style={[styles.dollars, { color: accent }]}>{formatMoney(state.dollars)}</Text>
        <View style={styles.badges}>
          {comboBoost && (
            <View style={[styles.badge, styles.comboBadge]}>
              <PixelIcon name="bolt" size={9} color="#FF8800" />
              <Text style={styles.badgeText}>2x KOMBO  {secsLeft(comboBoost.expiresAt, now)}s</Text>
            </View>
          )}
          {skuggaBoost && (
            <View style={[styles.badge, styles.skuggaBadge]}>
              <PixelIcon name="ghost" size={9} color="#00DDFF" />
              <Text style={styles.badgeText}>+10%  {secsLeft(skuggaBoost.expiresAt, now)}s</Text>
            </View>
          )}
          {dailyBoost && (
            <View style={[styles.badge, styles.boostBadge]}>
              <PixelIcon name="gift" size={9} color="#FFB800" />
              <Text style={styles.badgeText}>{dailyBoost.multiplier}x  {secsLeft(dailyBoost.expiresAt, now)}s</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomRow}>
        {isIdle ? (
          <View style={styles.nudgeRow}>
            <PixelIcon name="arrow_up" size={10} color="#FF9500" />
            <Text style={styles.nudge}>{s.nudge}</Text>
          </View>
        ) : (
          <Text style={[styles.rate, { color: COLORS.green }]}>+{formatRate(productionRate)} passivt</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#111111',
    borderBottomWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bottomRow: {},
  nudgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dollars: {
    fontSize: 36,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rate: {
    fontSize: 12,
    fontFamily: 'Courier New',
    letterSpacing: 0.5,
  },
  nudge: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: '#FF9500',
    letterSpacing: 0.3,
  },
  badges: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
  },
  comboBadge: {
    backgroundColor: '#400000',
    borderColor: '#FF4444',
  },
  skuggaBadge: {
    backgroundColor: '#0A0A2A',
    borderColor: '#00FFFF',
  },
  boostBadge: {
    backgroundColor: '#2A1A00',
    borderColor: '#FFB800',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.white,
    fontWeight: 'bold',
  },
})
