import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useGame } from '../context/GameContext'
import { WORLDS } from '../constants/worlds'
import { COLORS } from '../constants/colors'
import { formatMoney } from '../lib/formatting'
import PixelIcon from '../components/ui/PixelIcon'

const TIER_LABELS = ['Nivå 1', 'Nivå 2', 'Nivå 3', 'Nivå 4']

// Render N filled + (4-N) empty stars using PixelIcon
function TierStars({ tier, color }: { tier: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[0, 1, 2, 3].map(i => (
        <PixelIcon key={i} name="star" size={8} color={i < tier + 1 ? color : '#333'} />
      ))}
    </View>
  )
}

export default function WorldsScreen() {
  const { state, purchaseWorld, switchWorld } = useGame()
  const purchased = state.purchasedWorlds ?? [0]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <PixelIcon name="globe" size={16} color={COLORS.gold} />
          <Text style={styles.headerTitle}>VÄRLDAR</Text>
        </View>
        <Text style={styles.headerSub}>Köp och byt fabrik</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {WORLDS.map((world, idx) => {
          const isPurchased = purchased.includes(world.id)
          const isCurrent   = state.currentWorldId === world.id
          const canAfford   = state.dollars >= world.unlockCost
          const progress    = state.worldProgress?.find(p => p.worldId === world.id)
          const earnedHere  = progress?.totalEarnedInWorld ?? 0

          return (
            <View
              key={world.id}
              style={[
                styles.card,
                { borderColor: world.theme.accent },
                isCurrent && { backgroundColor: world.theme.sky },
                !isPurchased && !canAfford && styles.cardLocked,
              ]}
            >
              {/* Header row */}
              <View style={styles.cardHeader}>
                <View style={styles.worldIconBox}>
                  <PixelIcon name={world.icon} size={32} color={world.theme.accent} />
                </View>
                <View style={styles.worldInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.worldName, { color: world.theme.accent }]}>{world.name}</Text>
                    <TierStars tier={idx} color={world.theme.accent} />
                  </View>
                  <Text style={styles.worldProduct}>{world.product}</Text>
                  <Text style={[styles.tierLabel, { color: world.theme.accent }]}>{TIER_LABELS[idx]}</Text>
                </View>
                {isCurrent && (
                  <View style={[styles.activeBadge, { backgroundColor: world.theme.accent }]}>
                    <Text style={styles.activeBadgeText}>AKTIV</Text>
                  </View>
                )}
              </View>

              <Text style={styles.worldDesc}>{world.description}</Text>

              {isPurchased && earnedHere > 0 && (
                <Text style={[styles.earnedHere, { color: world.theme.accent }]}>
                  Tjänat här: {formatMoney(earnedHere)}
                </Text>
              )}

              {/* Action area */}
              {isCurrent ? (
                <View style={[styles.activeBar, { borderColor: world.theme.accent }]}>
                  <PixelIcon name="check" size={12} color={world.theme.accent} />
                  <Text style={[styles.activeBarText, { color: world.theme.accent }]}>
                    Du jobbar här just nu
                  </Text>
                </View>
              ) : isPurchased ? (
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: world.theme.accent }]}
                  onPress={() => switchWorld(world.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.actionBtnText, { color: world.theme.accent }]}>
                    BYTA TILL {world.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buyArea}>
                  {!canAfford && (
                    <View style={styles.progressWrap}>
                      <Text style={styles.progressLabel}>
                        {formatMoney(state.dollars)} / {formatMoney(world.unlockCost)}
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(100, (state.dollars / world.unlockCost) * 100)}%` as any,
                              backgroundColor: world.theme.accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      canAfford
                        ? { borderColor: world.theme.accent, backgroundColor: world.theme.primary }
                        : styles.buyBtnDisabled,
                    ]}
                    onPress={() => canAfford && purchaseWorld(world.id)}
                    disabled={!canAfford}
                    activeOpacity={0.75}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <PixelIcon
                        name={canAfford ? 'factory' : 'lock'}
                        size={12}
                        color={canAfford ? world.theme.accent : COLORS.greyDark}
                      />
                      <Text style={[styles.actionBtnText, !canAfford && styles.disabledText, canAfford && { color: world.theme.accent }]}>
                        {canAfford ? `KÖP FÖR ${formatMoney(world.unlockCost)}` : formatMoney(world.unlockCost)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 2,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginTop: 2,
  },
  list: { padding: 12, gap: 12 },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderRadius: 8,
    padding: 14,
  },
  cardLocked: { opacity: 0.6 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  worldIconBox: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  worldInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  worldName: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
  },
  worldProduct: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginBottom: 2,
  },
  tierLabel: {
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },

  worldDesc: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    lineHeight: 16,
    marginBottom: 12,
  },
  earnedHere: {
    fontSize: 11,
    fontFamily: 'Courier New',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  activeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 6,
  },
  activeBarText: {
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  buyArea: { gap: 8 },
  progressWrap: { marginBottom: 2 },
  progressLabel: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginBottom: 4,
    textAlign: 'right',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  actionBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 6,
  },
  buyBtnDisabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabledText: { color: COLORS.greyDark },
})
