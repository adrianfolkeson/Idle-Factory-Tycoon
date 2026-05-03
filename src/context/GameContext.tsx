import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { AppState } from 'react-native'
import { GameState, GameAction, ActiveBoost } from '../types'
import { gameReducer } from '../reducers/gameReducer'
import { saveGame, loadGame, clearSave } from '../lib/storage'
import {
  createInitialState,
  computeProductionRate,
  computeClickValue,
  computeOfflineEarnings,
  getUpgradeCount,
  getUpgradeCost,
  isNewDay,
  SKUGGA_DURATION_MS,
  SKUGGA_MIN_INTERVAL_MS,
  SKUGGA_MAX_INTERVAL_MS,
  COMBO_TAP_COUNT,
  COMBO_WINDOW_MS,
  COMBO_MULTIPLIER,
  COMBO_DURATION_MS,
  DAILY_REWARDS,
} from '../lib/gameEngine'
import { WORLDS } from '../constants/worlds'
import { ACHIEVEMENTS } from '../constants/achievements'

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  productionRate: number
  clickValue: number
  skuggaVisible: boolean
  offlineEarnings: number
  pendingAchievement: string | null
  dismissOfflineEarnings: () => void
  dismissAchievement: () => void
  tap: () => void
  buyUpgrade: (upgradeId: string, n?: number) => boolean
  purchaseWorld: (worldId: number) => boolean
  switchWorld: (worldId: number) => void
  claimDailyReward: () => void
  resetGame: () => void
  showDailyReward: boolean
  setShowDailyReward: (v: boolean) => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState())
  const [loaded, setLoaded] = useState(false)
  const [skuggaVisible, setSkuggaVisible] = useState(false)
  const [offlineEarnings, setOfflineEarnings] = useState(0)
  const [pendingAchievement, setPendingAchievement] = useState<string | null>(null)
  const [showDailyReward, setShowDailyReward] = useState(false)
  const stateRef = useRef(state)
  const tapTimestamps = useRef<number[]>([])
  const comboActive = useRef(false)
  const skuggaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const achievementQueue = useRef<string[]>([])
  const showingAchievement = useRef(false)

  stateRef.current = state

  const showNextAchievement = useCallback(() => {
    if (showingAchievement.current || achievementQueue.current.length === 0) return
    showingAchievement.current = true
    const next = achievementQueue.current.shift()!
    setPendingAchievement(next)
    setTimeout(() => {
      setPendingAchievement(null)
      showingAchievement.current = false
      showNextAchievement()
    }, 3000)
  }, [])

  useEffect(() => {
    const prevAch = stateRef.current.unlockedAchievements
    const newAch = state.unlockedAchievements.filter(id => !prevAch.includes(id))
    if (newAch.length > 0) {
      achievementQueue.current.push(...newAch)
      showNextAchievement()
    }
  }, [state.unlockedAchievements, showNextAchievement])

  useEffect(() => {
    async function init() {
      const saved = await loadGame()
      if (saved) {
        const offline = computeOfflineEarnings(saved)
        dispatch({ type: 'LOAD_SAVE', state: saved })
        if (offline > 0) {
          setOfflineEarnings(offline)
          dispatch({ type: 'APPLY_OFFLINE_EARNINGS', amount: offline })
        }
        if (isNewDay(saved.dailyReward.lastClaimedDate)) {
          setShowDailyReward(true)
        }
      } else {
        setShowDailyReward(true)
      }
      setLoaded(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!loaded) return
    const interval = setInterval(() => {
      const s = stateRef.current
      const rate = computeProductionRate(s)
      const earnings = rate * 0.1
      if (earnings > 0) {
        dispatch({ type: 'TICK', earnings, deltaMs: 100 })
      }
      dispatch({ type: 'EXPIRE_BOOSTS' })
      dispatch({ type: 'TICK_STATS', deltaMs: 100 })
    }, 100)
    return () => clearInterval(interval)
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    const interval = setInterval(() => {
      saveGame(stateRef.current)
    }, 10000)
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        saveGame(stateRef.current)
      }
    })
    return () => {
      clearInterval(interval)
      sub.remove()
    }
  }, [loaded])

  const scheduleSkugga = useCallback(() => {
    if (skuggaTimer.current) clearTimeout(skuggaTimer.current)
    const delay = SKUGGA_MIN_INTERVAL_MS + Math.random() * (SKUGGA_MAX_INTERVAL_MS - SKUGGA_MIN_INTERVAL_MS)
    skuggaTimer.current = setTimeout(() => {
      setSkuggaVisible(true)
      dispatch({ type: 'SKUGGA_APPEARED' })
      const boost: ActiveBoost = {
        id: 'skugga',
        multiplier: 1.1,
        expiresAt: Date.now() + SKUGGA_DURATION_MS,
      }
      dispatch({ type: 'ADD_BOOST', boost })
      setTimeout(() => {
        setSkuggaVisible(false)
        scheduleSkugga()
      }, SKUGGA_DURATION_MS)
    }, delay)
  }, [])

  useEffect(() => {
    if (!loaded) return
    scheduleSkugga()
    return () => {
      if (skuggaTimer.current) clearTimeout(skuggaTimer.current)
    }
  }, [loaded, scheduleSkugga])

  const tap = useCallback(() => {
    const now = Date.now()
    tapTimestamps.current = tapTimestamps.current.filter(t => now - t < COMBO_WINDOW_MS)
    tapTimestamps.current.push(now)

    if (!comboActive.current && tapTimestamps.current.length >= COMBO_TAP_COUNT) {
      comboActive.current = true
      tapTimestamps.current = []
      const boost: ActiveBoost = {
        id: 'combo',
        multiplier: COMBO_MULTIPLIER,
        expiresAt: now + COMBO_DURATION_MS,
      }
      dispatch({ type: 'ADD_BOOST', boost })
      dispatch({ type: 'COMBO_ACTIVATED' })
      setTimeout(() => {
        comboActive.current = false
      }, COMBO_DURATION_MS)
    }

    const cv = computeClickValue(stateRef.current)
    dispatch({ type: 'TAP', clickValue: cv })
  }, [])

  const buyUpgrade = useCallback((upgradeId: string, n = 1): boolean => {
    const s = stateRef.current
    const progress = s.worldProgress[s.currentWorldId]
    if (!progress) return false
    const count = getUpgradeCount(progress, upgradeId)
    const cost = getUpgradeCost(upgradeId, count)
    if (s.dollars < cost) return false
    if (n === 1) {
      dispatch({ type: 'BUY_UPGRADE', upgradeId, cost })
    } else {
      dispatch({ type: 'BUY_UPGRADE_N', upgradeId, n })
    }
    return true
  }, [])

  const purchaseWorld = useCallback((worldId: number): boolean => {
    const s = stateRef.current
    const world = WORLDS[worldId]
    if (!world || s.purchasedWorlds?.includes(worldId)) return false
    if (s.dollars < world.unlockCost) return false
    dispatch({ type: 'PURCHASE_WORLD', worldId, cost: world.unlockCost })
    return true
  }, [])

  const switchWorld = useCallback((worldId: number) => {
    const s = stateRef.current
    if (!s.purchasedWorlds?.includes(worldId)) return
    dispatch({ type: 'SWITCH_WORLD', worldId })
    saveGame({ ...s, currentWorldId: worldId })
  }, [])

  const claimDailyReward = useCallback(() => {
    const s = stateRef.current
    const streakIdx = Math.max(0, ((s.dailyReward.streak) % DAILY_REWARDS.length))
    const reward = DAILY_REWARDS[streakIdx]
    dispatch({ type: 'CLAIM_DAILY_REWARD', reward })
    setShowDailyReward(false)
  }, [])

  const resetGame = useCallback(async () => {
    await clearSave()
    dispatch({ type: 'RESET_GAME' })
    dispatch({ type: 'LOAD_SAVE', state: createInitialState() })
  }, [])

  const productionRate = computeProductionRate(state)
  const clickValue = computeClickValue(state)

  if (!loaded) return null

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        productionRate,
        clickValue,
        skuggaVisible,
        offlineEarnings,
        pendingAchievement,
        dismissOfflineEarnings: () => setOfflineEarnings(0),
        dismissAchievement: () => setPendingAchievement(null),
        tap,
        buyUpgrade,
        purchaseWorld,
        switchWorld,
        claimDailyReward,
        resetGame,
        showDailyReward,
        setShowDailyReward,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
