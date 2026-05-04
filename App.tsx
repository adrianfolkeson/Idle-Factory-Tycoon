import React, { useEffect, useState } from 'react'
import { View, StyleSheet, AppState, Modal } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { GameProvider, useGame } from './src/context/GameContext'
import TabBar, { TabName } from './src/components/ui/TabBar'
import FactoryScreen from './src/screens/FactoryScreen'
import UpgradesScreen from './src/screens/UpgradesScreen'
import WorldsScreen from './src/screens/WorldsScreen'
import StatsScreen from './src/screens/StatsScreen'
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen'
import AchievementToast from './src/components/modals/AchievementToast'
import OfflineEarningsModal from './src/components/modals/OfflineEarningsModal'
import DailyRewardModal from './src/components/modals/DailyRewardModal'
import OnboardingOverlay from './src/components/modals/OnboardingOverlay'
import Ads from './components/Ads'
import { COLORS } from './src/constants/colors'
import { WORLDS } from './src/constants/worlds'
import { getUpgradeCost, getUpgradeCount } from './src/lib/gameEngine'
import {
  requestNotificationPermissions,
  scheduleFactoryNotifications,
  cancelFactoryNotifications,
} from './src/lib/notifications'
import { trackSessionAndMaybeRate } from './src/lib/ratingPrompt'
import { soundManager } from './src/lib/soundManager'

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabName>('factory')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const {
    state, productionRate,
    pendingAchievement, dismissAchievement,
    offlineEarnings, dismissOfflineEarnings,
    showDailyReward, setShowDailyReward,
  } = useGame()

  // Notification permissions + session tracking on mount
  useEffect(() => {
    requestNotificationPermissions()
    trackSessionAndMaybeRate()
    soundManager.load()
    return () => { soundManager.unload() }
  }, [])

  // Schedule / cancel notifications based on AppState
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'background' || nextState === 'inactive') {
        scheduleFactoryNotifications(productionRate, state.dollars)
      } else if (nextState === 'active') {
        cancelFactoryNotifications()
      }
    })
    return () => sub.remove()
  }, [productionRate, state.dollars])

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
      case 'stats':    return <StatsScreen onOpenPrivacy={() => setShowPrivacy(true)} />
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
      <OnboardingOverlay />

      {/* Ads */}
      <Ads />

      {/* Privacy policy modal */}
      <Modal visible={showPrivacy} animationType="slide" onRequestClose={() => setShowPrivacy(false)}>
        <PrivacyPolicyScreen onClose={() => setShowPrivacy(false)} />
      </Modal>
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
  root: { flex: 1, backgroundColor: COLORS.bg },
  screen: { flex: 1 },
})
