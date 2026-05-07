import { GameState, WorldProgress } from '../types'
import { WORLDS } from '../constants/worlds'

export const COST_SCALE = 1.18            // was 1.15 — steeper exponential curve
export const BASE_CLICK_VALUE = 0.05      // was 0.1 — slower early tapping
export const MAX_OFFLINE_MS = 2 * 60 * 60 * 1000  // was 4h — 2h offline cap
export const PRODUCTION_MULTIPLIER = 0.32 // global auto-production nerf
export const CLICK_MULTIPLIER = 0.38      // global click-bonus nerf
export const PRESTIGE_THRESHOLD = 5e14    // $500T total earned to unlock prestige
export const SKUGGA_MULTIPLIER = 1.1
export const SKUGGA_DURATION_MS = 30000
export const SKUGGA_MIN_INTERVAL_MS = 120000
export const SKUGGA_MAX_INTERVAL_MS = 300000
export const COMBO_TAP_COUNT = 5
export const COMBO_WINDOW_MS = 2000
export const COMBO_MULTIPLIER = 2
export const COMBO_DURATION_MS = 5000

export function getUpgradeCost(upgradeId: string, currentCount: number): number {
  for (const world of WORLDS) {
    const upg = world.upgrades.find(u => u.id === upgradeId)
    if (upg) return Math.ceil(upg.baseCost * Math.pow(COST_SCALE, currentCount))
  }
  return Infinity
}

export function getUpgradeCount(progress: WorldProgress, upgradeId: string): number {
  return progress.upgrades.find(u => u.id === upgradeId)?.count ?? 0
}

export function computeProductionRate(state: GameState): number {
  const world = WORLDS[state.currentWorldId]
  if (!world) return 0
  const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
  if (!progress) return 0

  let base = 0
  for (const upgDef of world.upgrades) {
    const count = getUpgradeCount(progress, upgDef.id)
    base += upgDef.baseProduction * count
  }

  const boostMultiplier = getActiveBoostMultiplier(state)
  const worldBonus = state.worldCompletionBonuses[state.currentWorldId] ?? 1
  const prestigeBonus = state.prestigeMultiplier ?? 1

  return base * PRODUCTION_MULTIPLIER * boostMultiplier * worldBonus * prestigeBonus
}

export function computeClickValue(state: GameState): number {
  const world = WORLDS[state.currentWorldId]
  if (!world) return BASE_CLICK_VALUE
  const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
  if (!progress) return BASE_CLICK_VALUE

  let base = BASE_CLICK_VALUE
  for (const upgDef of world.upgrades) {
    const count = getUpgradeCount(progress, upgDef.id)
    base += upgDef.clickBonus * count * CLICK_MULTIPLIER
  }

  const boostMultiplier = getActiveBoostMultiplier(state)
  return base * boostMultiplier
}

export function getActiveBoostMultiplier(state: GameState): number {
  const now = Date.now()
  return state.activeBoosts
    .filter(b => b.expiresAt > now)
    .reduce((acc, b) => acc * b.multiplier, 1)
}

export function computeOfflineEarnings(state: GameState): number {
  const now = Date.now()
  const awayMs = Math.min(now - state.lastSavedAt, MAX_OFFLINE_MS)
  if (awayMs < 60000) return 0
  const rate = computeProductionRateWithoutBoosts(state)
  return rate * (awayMs / 1000)
}

function computeProductionRateWithoutBoosts(state: GameState): number {
  const world = WORLDS[state.currentWorldId]
  if (!world) return 0
  const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
  if (!progress) return 0

  let base = 0
  for (const upgDef of world.upgrades) {
    const count = getUpgradeCount(progress, upgDef.id)
    base += upgDef.baseProduction * count
  }

  const worldBonus = state.worldCompletionBonuses[state.currentWorldId] ?? 1
  const prestigeBonus = state.prestigeMultiplier ?? 1
  return base * PRODUCTION_MULTIPLIER * worldBonus * prestigeBonus
}

export function createInitialWorldProgress(worldId: number): WorldProgress {
  const world = WORLDS[worldId]
  return {
    worldId,
    upgrades: world.upgrades.map(u => ({ id: u.id, count: 0 })),
    totalEarnedInWorld: 0,
  }
}

export function createInitialState(): GameState {
  return {
    version: 1,
    currentWorldId: 0,
    dollars: 15,        // enough to buy first upgrade immediately
    totalEarned: 15,
    worldProgress: WORLDS.map(w => createInitialWorldProgress(w.id)),
    dailyReward: {
      lastClaimedDate: null,
      streak: 0,
      claimedToday: false,
    },
    unlockedAchievements: [],
    activeBoosts: [],
    stats: {
      totalTimePlayed: 0,
      totalTaps: 0,
      totalUpgradesPurchased: 0,
      skuggaSightings: 0,
      combosActivated: 0,
    },
    lastSavedAt: Date.now(),
    worldCompletionBonuses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    skuggaLastAppeared: 0,
    purchasedWorlds: [0],
    prestige: 0,
    prestigeMultiplier: 1,
  }
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function isNewDay(lastDate: string | null): boolean {
  if (!lastDate) return true
  return lastDate !== getTodayString()
}

export function getStreakCount(lastDate: string | null, currentStreak: number): number {
  if (!lastDate) return 1
  const last = new Date(lastDate)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return currentStreak + 1
  if (diffDays === 0) return currentStreak
  return 1
}

export const DAILY_REWARDS = [
  { kind: 'cash' as const, amount: 100, label: '+$100' },
  { kind: 'boost' as const, multiplier: 2, durationMs: 30 * 60 * 1000, label: '2x / 30min' },
  { kind: 'cash' as const, amount: 500, label: '+$500' },
  { kind: 'boost' as const, multiplier: 3, durationMs: 30 * 60 * 1000, label: '3x / 30min' },
  { kind: 'cash' as const, amount: 2000, label: '+$2,000' },
  { kind: 'boost' as const, multiplier: 2, durationMs: 2 * 60 * 60 * 1000, label: '2x / 2tim' },
  { kind: 'boost' as const, multiplier: 5, durationMs: 4 * 60 * 60 * 1000, label: '5x / 4tim' },
]
