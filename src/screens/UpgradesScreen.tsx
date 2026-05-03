import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useGame } from '../context/GameContext'
import { WORLDS } from '../constants/worlds'
import { COLORS } from '../constants/colors'
import { formatMoney, formatRate } from '../lib/formatting'
import { getUpgradeCost, getUpgradeCount } from '../lib/gameEngine'
import PixelIcon from '../components/ui/PixelIcon'

type BulkMode = 1 | 10 | 'max'

function getCostForN(upgradeId: string, startCount: number, n: number): number {
  let total = 0
  for (let i = 0; i < n; i++) total += getUpgradeCost(upgradeId, startCount + i)
  return total
}

function getMaxAffordable(upgradeId: string, dollars: number, startCount: number, cap = 100): number {
  let total = 0
  for (let i = 0; i < cap; i++) {
    const c = getUpgradeCost(upgradeId, startCount + i)
    if (dollars < total + c) return i
    total += c
  }
  return cap
}

export default function UpgradesScreen() {
  const { state, buyUpgrade } = useGame()
  const [bulk, setBulk] = useState<BulkMode>(1)
  const world = WORLDS[state.currentWorldId]
  const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
  if (!world || !progress) return null

  // Find cheapest affordable upgrade to highlight as recommended
  const recommendedId = (() => {
    let best: string | null = null
    let bestCost = Infinity
    for (const upg of world.upgrades) {
      const count = getUpgradeCount(progress, upg.id)
      const cost = getUpgradeCost(upg.id, count)
      if (state.dollars >= cost && cost < bestCost) {
        bestCost = cost
        best = upg.id
      }
    }
    return best
  })()

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: world.theme.accent }]}>
        <View style={styles.headerTop}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <PixelIcon name={world.icon} size={14} color={world.theme.accent} />
              <Text style={styles.headerTitle}>UPPGRADERINGAR</Text>
            </View>
            <Text style={styles.headerSub}>{world.name} • {world.product}</Text>
          </View>
          <View style={styles.bulkToggle}>
            {([1, 10, 'max'] as BulkMode[]).map(m => (
              <TouchableOpacity
                key={String(m)}
                style={[styles.bulkBtn, bulk === m && styles.bulkBtnActive, bulk === m && { borderColor: world.theme.accent }]}
                onPress={() => setBulk(m)}
                activeOpacity={0.7}
              >
                <Text style={[styles.bulkBtnText, bulk === m && { color: world.theme.accent }]}>
                  {m === 'max' ? 'MAX' : `×${m}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {world.upgrades.map(upg => {
          const count = getUpgradeCount(progress, upg.id)
          const nextCost = getUpgradeCost(upg.id, count)
          const canAffordOne = state.dollars >= nextCost
          const totalProd = count * upg.baseProduction
          const totalClick = count * upg.clickBonus

          const maxN = bulk === 'max'
            ? getMaxAffordable(upg.id, state.dollars, count)
            : bulk
          const bulkCost = bulk === 1
            ? nextCost
            : getCostForN(upg.id, count, maxN)
          const buyN = bulk === 1 ? 1 : maxN
          const isRecommended = upg.id === recommendedId

          return (
            <View key={upg.id} style={[
              styles.card,
              { borderLeftColor: world.theme.accent },
              isRecommended && styles.cardRecommended,
              isRecommended && { borderColor: world.theme.accent },
            ]}>
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.upgName}>{upg.name}</Text>
                    {count > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>×{count}</Text>
                      </View>
                    )}
                    {isRecommended && (
                      <View style={[styles.recBadge, { backgroundColor: world.theme.accent }]}>
                        <PixelIcon name="star" size={8} color="#000" />
                        <Text style={styles.recBadgeText}>KÖP NU</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.upgDesc}>{upg.description}</Text>
                  <View style={styles.statsRow}>
                    {upg.baseProduction > 0 && (
                      <View style={styles.statRow}>
                        <PixelIcon name="gear" size={10} color={COLORS.green} />
                        <Text style={styles.stat}>+{formatRate(upg.baseProduction)}/enhet</Text>
                      </View>
                    )}
                    {upg.clickBonus > 0 && (
                      <View style={styles.statRow}>
                        <PixelIcon name="hand" size={10} color={COLORS.green} />
                        <Text style={styles.stat}>+{formatMoney(upg.clickBonus)}/klick</Text>
                      </View>
                    )}
                  </View>
                  {count > 0 && (
                    <Text style={styles.totalProd}>
                      Total: {formatRate(totalProd)} auto • {formatMoney(totalClick)}/klick
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.buyBtn, canAffordOne ? styles.buyBtnActive : styles.buyBtnDisabled, { borderColor: canAffordOne ? world.theme.accent : COLORS.border }]}
                onPress={() => buyUpgrade(upg.id, buyN)}
                disabled={!canAffordOne}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.buyPrice, !canAffordOne && styles.buyPriceDisabled]}>
                    {formatMoney(bulkCost)}
                  </Text>
                  <Text style={styles.separator}>·</Text>
                  <Text style={[styles.buyLabel, !canAffordOne && styles.buyLabelDisabled]}>
                    {bulk === 1 ? 'KÖP' : bulk === 'max' ? `×${maxN}` : `×${bulk}`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  bulkToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  bulkBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
  },
  bulkBtnActive: {
    backgroundColor: '#1A2A1A',
  },
  bulkBtnText: {
    fontSize: 11,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.greyDark,
  },
  list: {
    padding: 12,
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 14,
    gap: 10,
  },
  cardRecommended: {
    backgroundColor: '#141a0f',
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  recBadgeText: {
    fontSize: 9,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  cardTop: {
    flex: 1,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  upgName: {
    fontSize: 15,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  countBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  countText: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  upgDesc: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    marginBottom: 6,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stat: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.green,
  },
  totalProd: {
    fontSize: 9,
    fontFamily: 'Courier New',
    color: COLORS.gold,
    marginTop: 2,
  },
  buyBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderRadius: 6,
    width: '100%',
  },
  buyBtnActive: {
    backgroundColor: '#1A2A1A',
  },
  buyBtnDisabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.border,
  },
  buyPrice: {
    fontSize: 11,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 2,
  },
  buyPriceDisabled: {
    color: COLORS.disabledText,
  },
  buyLabel: {
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.green,
    letterSpacing: 1,
  },
  buyLabelDisabled: {
    color: COLORS.greyDark,
  },
  separator: {
    color: COLORS.greyDark,
    fontSize: 14,
    fontFamily: 'Courier New',
  },
  bottomPad: { height: 20 },
})
