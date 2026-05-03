import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { GameProvider, useGame } from './src/context/GameContext'
import TabBar, { TabName } from './src/components/ui/TabBar'
import FactoryScreen from './src/screens/FactoryScreen'
import UpgradesScreen from './src/screens/UpgradesScreen'
import WorldsScreen from './src/screens/WorldsScreen'
import StatsScreen from './src/screens/StatsScreen'
import AchievementToast from './src/components/modals/AchievementToast'
import OfflineEarningsModal from './src/components/modals/OfflineEarningsModal'
import DailyRewardModal from './src/components/modals/DailyRewardModal'
import { COLORS } from './src/constants/colors'
import { WORLDS } from './src/constants/worlds'
import { getUpgradeCost, getUpgradeCount } from './src/lib/gameEngine'

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabName>('factory')
  const { state, pendingAchievement, dismissAchievement, offlineEarnings, dismissOfflineEarnings, showDailyReward, setShowDailyReward } = useGame()

  const upgradeBadge = (() => {
    const world = WORLDS[state.currentWorldId]
    if (!world) return false
    const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
    if (!progress) return false
    return world.upgrades.some(upg => {
      const count = getUpgradeCount(progress, upg.id)
      return state.dollars >= getUpgradeCost(upg.id, count)
    })
  })()

  const renderScreen = () => {
    switch (activeTab) {
      case 'factory':  return <FactoryScreen />
      case 'upgrades': return <UpgradesScreen />
      case 'worlds':   return <WorldsScreen />
      case 'stats':    return <StatsScreen />
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" backgroundColor="#000000" />

      <View style={styles.screen}>
        {renderScreen()}
      </View>

      <TabBar active={activeTab} onPress={setActiveTab} upgradeBadge={upgradeBadge} />

      {/* Overlays */}
      <AchievementToast achievementId={pendingAchievement} />
      <OfflineEarningsModal amount={offlineEarnings} onDismiss={dismissOfflineEarnings} />
      {showDailyReward && <DailyRewardModal onClose={() => setShowDailyReward(false)} />}
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screen: {
    flex: 1,
  },
})
