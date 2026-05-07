import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, AppState, Modal, Animated } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { GameProvider, useGame } from './src/context/GameContext'
import TabBar, { TabName } from './src/components/ui/TabBar'
import FactoryScreen from './src/screens/FactoryScreen'
import UpgradesScreen from './src/screens/UpgradesScreen'
import WorldsScreen from './src/screens/WorldsScreen'
import StatsScreen from './src/screens/StatsScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen'
import AchievementToast from './src/components/modals/AchievementToast'
import OfflineEarningsModal from './src/components/modals/OfflineEarningsModal'
import DailyRewardModal from './src/components/modals/DailyRewardModal'
import OnboardingOverlay from './src/components/modals/OnboardingOverlay'
import PrestigeCelebration from './src/components/modals/PrestigeCelebration'
import MilestoneToast from './src/components/hud/MilestoneToast'
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
import { analytics } from './src/lib/analytics'
import { initSentry } from './src/lib/sentry'
import LoadingScreen from './src/components/LoadingScreen'
import * as SplashScreen from 'expo-splash-screen'

// Keep splash visible until app is ready
SplashScreen.preventAutoHideAsync().catch(() => {})

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabName>('factory')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const {
    state, productionRate,
    pendingAchievement, dismissAchievement,
    offlineEarnings, dismissOfflineEarnings,
    showDailyReward, setShowDailyReward,
    showPrestigeCelebration,
    adsRemoved,
  } = useGame()

  // World transition opacity
  const screenOp = useRef(new Animated.Value(1)).current
  const prevWorld = useRef(state.currentWorldId)
  useEffect(() => {
    if (prevWorld.current !== state.currentWorldId) {
      prevWorld.current = state.currentWorldId
      Animated.sequence([
        Animated.timing(screenOp, { toValue:0, duration:220, useNativeDriver:true }),
        Animated.timing(screenOp, { toValue:1, duration:380, useNativeDriver:true }),
      ]).start()
    }
  }, [state.currentWorldId])

  // Init on mount
  useEffect(() => {
    requestNotificationPermissions()
    trackSessionAndMaybeRate()
    soundManager.load()
    initSentry()
    analytics.sessionStart(state.currentWorldId)
    return () => { soundManager.unload(); analytics.flush().catch(() => {}) }
  }, [])

  // Notifications on background/foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next === 'background' || next === 'inactive') {
        scheduleFactoryNotifications(productionRate, state.dollars)
      } else if (next === 'active') {
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
      case 'settings': return <SettingsScreen onOpenPrivacy={() => setShowPrivacy(true)} />
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" backgroundColor="#000000" />

      <Animated.View style={[styles.screen, { opacity: screenOp }]}>
        {renderScreen()}
      </Animated.View>

      {/* Banner ad removed — revenue via rewarded ads only */}

      <TabBar active={activeTab} onPress={setActiveTab} upgradeBadge={upgradeBadge} />

      {/* Overlays */}
      <MilestoneToast rate={productionRate} />
      <AchievementToast achievementId={pendingAchievement} />
      <OfflineEarningsModal amount={offlineEarnings} onDismiss={dismissOfflineEarnings} />
      {showDailyReward && <DailyRewardModal onClose={() => setShowDailyReward(false)} />}
      <OnboardingOverlay />
      <PrestigeCelebration
        visible={showPrestigeCelebration}
        newPrestige={state.prestige ?? 0}
        multiplier={state.prestigeMultiplier ?? 1}
      />

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
  root: { flex:1, backgroundColor: COLORS.bg },
  screen: { flex:1 },
})
