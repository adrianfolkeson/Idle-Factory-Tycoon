import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../../constants/colors'
import PixelIcon from './PixelIcon'
import { s } from '../../lib/i18n'

export type TabName = 'factory' | 'upgrades' | 'worlds' | 'stats'

interface Tab {
  name: TabName
  label: string
  icon: string
}

const TABS: Tab[] = [
  { name: 'factory',  label: s.tabFactory,  icon: 'factory' },
  { name: 'upgrades', label: s.tabUpgrades, icon: 'gear'    },
  { name: 'worlds',   label: s.tabWorlds,   icon: 'globe'   },
  { name: 'stats',    label: s.tabStats,    icon: 'trophy'  },
]

interface Props {
  active: TabName
  onPress: (tab: TabName) => void
  upgradeBadge?: boolean
}

export default function TabBar({ active, onPress, upgradeBadge }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4 }]}>
      {TABS.map(tab => {
        const isActive = tab.name === active
        const showBadge = tab.name === 'upgrades' && upgradeBadge && !isActive
        const iconColor = isActive ? COLORS.gold : '#555555'
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <PixelIcon name={tab.icon} size={20} color={iconColor} />
              {showBadge && <View style={styles.badge} />}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  iconWrap: { position: 'relative', marginBottom: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#111',
  },
  label: {
    fontSize: 9,
    color: '#555555',
    fontFamily: 'Courier New',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: COLORS.gold,
  },
  indicator: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    marginTop: 3,
  },
})
