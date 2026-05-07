import { GameState, GameAction, ActiveBoost } from '../types'
import { ACHIEVEMENTS } from '../constants/achievements'
import { getUpgradeCost, getUpgradeCount, getTodayString, getStreakCount, DAILY_REWARDS } from '../lib/gameEngine'
import { WORLDS } from '../constants/worlds'

function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = []
  for (const ach of ACHIEVEMENTS) {
    if (!state.unlockedAchievements.includes(ach.id) && ach.check(state)) {
      newlyUnlocked.push(ach.id)
    }
  }
  return newlyUnlocked
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_SAVE': {
      const s = action.state

      // Migrate: add worldProgress entries for any worlds added since save was created
      const migratedProgress = WORLDS.map(w => {
        const existing = s.worldProgress?.find(p => p.worldId === w.id)
        if (existing) return existing
        return {
          worldId: w.id,
          upgrades: w.upgrades.map(u => ({ id: u.id, count: 0 })),
          totalEarnedInWorld: 0,
        }
      })

      // Migrate: expand worldCompletionBonuses if too short
      const bonuses = s.worldCompletionBonuses ?? []
      while (bonuses.length < WORLDS.length) bonuses.push(1)

      // Migrate: purchasedWorlds
      const purchased = s.purchasedWorlds ?? WORLDS
        .filter(w => w.id === 0 || s.totalEarned >= w.unlockCost)
        .map(w => w.id)

      return {
        ...s,
        worldProgress: migratedProgress,
        worldCompletionBonuses: bonuses,
        purchasedWorlds: purchased,
        prestige: s.prestige ?? 0,
        prestigeMultiplier: s.prestigeMultiplier ?? 1,
      }
    }

    case 'TAP': {
      const next: GameState = {
        ...state,
        dollars: state.dollars + action.clickValue,
        totalEarned: state.totalEarned + action.clickValue,
        stats: { ...state.stats, totalTaps: state.stats.totalTaps + 1 },
      }
      const newAch = checkAchievements(next)
      return newAch.length > 0
        ? { ...next, unlockedAchievements: [...next.unlockedAchievements, ...newAch] }
        : next
    }

    case 'TICK': {
      if (action.earnings <= 0) return state
      const next: GameState = {
        ...state,
        dollars: state.dollars + action.earnings,
        totalEarned: state.totalEarned + action.earnings,
      }
      const wpIdx = next.worldProgress.findIndex(p => p.worldId === next.currentWorldId)
      let withProgress = next
      if (wpIdx >= 0) {
        const wp = next.worldProgress[wpIdx]
        const newProgress = [...next.worldProgress]
        newProgress[wpIdx] = { ...wp, totalEarnedInWorld: wp.totalEarnedInWorld + action.earnings }
        withProgress = { ...next, worldProgress: newProgress }
      }
      const newAch = checkAchievements(withProgress)
      return newAch.length > 0
        ? { ...withProgress, unlockedAchievements: [...withProgress.unlockedAchievements, ...newAch] }
        : withProgress
    }

    // ── Combined tick: TICK + EXPIRE_BOOSTS + TICK_STATS in one reducer call ──
    case 'GAME_TICK': {
      const now = Date.now()
      // Expire boosts + update time in one pass
      let s: GameState = {
        ...state,
        stats: { ...state.stats, totalTimePlayed: state.stats.totalTimePlayed + action.deltaMs },
        activeBoosts: state.activeBoosts.filter(b => b.expiresAt > now),
      }
      // Add earnings
      if (action.earnings > 0) {
        s = { ...s, dollars: s.dollars + action.earnings, totalEarned: s.totalEarned + action.earnings }
        const wpIdx = s.worldProgress.findIndex(p => p.worldId === s.currentWorldId)
        if (wpIdx >= 0) {
          const newProgress = [...s.worldProgress]
          newProgress[wpIdx] = { ...newProgress[wpIdx], totalEarnedInWorld: newProgress[wpIdx].totalEarnedInWorld + action.earnings }
          s = { ...s, worldProgress: newProgress }
        }
      }
      // Achievement check only every 10th tick (1s) to avoid 47-check×10/s overhead
      if (action.checkAch) {
        const newAch = checkAchievements(s)
        if (newAch.length > 0) s = { ...s, unlockedAchievements: [...s.unlockedAchievements, ...newAch] }
      }
      return s
    }

    case 'TICK_STATS': {
      return {
        ...state,
        stats: {
          ...state.stats,
          totalTimePlayed: state.stats.totalTimePlayed + action.deltaMs,
        },
      }
    }

    case 'APPLY_OFFLINE_EARNINGS': {
      if (action.amount <= 0) return state
      const next: GameState = {
        ...state,
        dollars: state.dollars + action.amount,
        totalEarned: state.totalEarned + action.amount,
      }
      const newAch = checkAchievements(next)
      return newAch.length > 0
        ? { ...next, unlockedAchievements: [...next.unlockedAchievements, ...newAch] }
        : next
    }

    case 'BUY_UPGRADE': {
      if (state.dollars < action.cost) return state
      const wpIdx = state.worldProgress.findIndex(p => p.worldId === state.currentWorldId)
      if (wpIdx < 0) return state
      const progress = state.worldProgress[wpIdx]

      const newUpgrades = progress.upgrades.map(u =>
        u.id === action.upgradeId ? { ...u, count: u.count + 1 } : u
      )
      const newProgress = [...state.worldProgress]
      newProgress[wpIdx] = { ...progress, upgrades: newUpgrades }

      const next: GameState = {
        ...state,
        dollars: state.dollars - action.cost,
        worldProgress: newProgress,
        stats: {
          ...state.stats,
          totalUpgradesPurchased: state.stats.totalUpgradesPurchased + 1,
        },
      }
      const newAch = checkAchievements(next)
      return newAch.length > 0
        ? { ...next, unlockedAchievements: [...next.unlockedAchievements, ...newAch] }
        : next
    }

    case 'PURCHASE_WORLD': {
      if (state.dollars < action.cost) return state
      if (state.purchasedWorlds.includes(action.worldId)) return state
      const newAch = checkAchievements({ ...state, purchasedWorlds: [...state.purchasedWorlds, action.worldId] })
      const next: GameState = {
        ...state,
        dollars: state.dollars - action.cost,
        purchasedWorlds: [...state.purchasedWorlds, action.worldId],
      }
      return newAch.length > 0
        ? { ...next, unlockedAchievements: [...next.unlockedAchievements, ...newAch] }
        : next
    }

    case 'SWITCH_WORLD': {
      if (action.worldId === state.currentWorldId) return state
      if (!state.purchasedWorlds.includes(action.worldId)) return state
      return { ...state, currentWorldId: action.worldId }
    }

    case 'CLAIM_DAILY_REWARD': {
      const today = getTodayString()
      const newStreak = getStreakCount(state.dailyReward.lastClaimedDate, state.dailyReward.streak)
      const rewardIndex = (newStreak - 1) % DAILY_REWARDS.length
      const reward = action.reward

      let next: GameState = {
        ...state,
        dailyReward: {
          lastClaimedDate: today,
          streak: newStreak,
          claimedToday: true,
        },
      }

      if (reward.kind === 'cash') {
        next = {
          ...next,
          dollars: next.dollars + reward.amount,
          totalEarned: next.totalEarned + reward.amount,
        }
      } else {
        const boost: ActiveBoost = {
          id: `daily_${Date.now()}`,
          multiplier: reward.multiplier,
          expiresAt: Date.now() + reward.durationMs,
        }
        next = { ...next, activeBoosts: [...next.activeBoosts, boost] }
      }

      const newAch = checkAchievements(next)
      return newAch.length > 0
        ? { ...next, unlockedAchievements: [...next.unlockedAchievements, ...newAch] }
        : next
    }

    case 'ADD_BOOST': {
      const filtered = state.activeBoosts.filter(b => b.id !== action.boost.id)
      return { ...state, activeBoosts: [...filtered, action.boost] }
    }

    case 'EXPIRE_BOOSTS': {
      const now = Date.now()
      const active = state.activeBoosts.filter(b => b.expiresAt > now)
      if (active.length === state.activeBoosts.length) return state
      return { ...state, activeBoosts: active }
    }

    case 'SKUGGA_APPEARED': {
      return {
        ...state,
        stats: { ...state.stats, skuggaSightings: state.stats.skuggaSightings + 1 },
        skuggaLastAppeared: Date.now(),
      }
    }

    case 'BUY_UPGRADE_N': {
      let s = state
      for (let i = 0; i < action.n; i++) {
        const idx = s.worldProgress.findIndex(p => p.worldId === s.currentWorldId)
        if (idx < 0) break
        const progress = s.worldProgress[idx]
        const count = getUpgradeCount(progress, action.upgradeId)
        const cost = getUpgradeCost(action.upgradeId, count)
        if (s.dollars < cost) break
        const newUpgrades = progress.upgrades.map(u =>
          u.id === action.upgradeId ? { ...u, count: u.count + 1 } : u
        )
        const newWorldProgress = [...s.worldProgress]
        newWorldProgress[idx] = { ...progress, upgrades: newUpgrades }
        s = {
          ...s,
          dollars: s.dollars - cost,
          worldProgress: newWorldProgress,
          stats: { ...s.stats, totalUpgradesPurchased: s.stats.totalUpgradesPurchased + 1 },
        }
      }
      if (s === state) return state
      const newAch = checkAchievements(s)
      return newAch.length > 0
        ? { ...s, unlockedAchievements: [...s.unlockedAchievements, ...newAch] }
        : s
    }

    case 'COMBO_ACTIVATED': {
      return {
        ...state,
        stats: { ...state.stats, combosActivated: state.stats.combosActivated + 1 },
      }
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.unlockedAchievements.includes(action.achievementId)) return state
      // Achievement cash rewards
      const ACHIEVEMENT_REWARDS: Record<string, number> = {
        first_buy: 50,
        tap_100:   500,
        tap_1000:  5000,
        earn_1k:   2000,
        earn_1m:   50000,
        earn_1b:   5000000,
        world_1:   100000,
        world_2:   2000000,
        world_3:   50000000,
        combo_5:   10000,
        skugga_10: 25000,
        streak_7:  100000,
        tap_500: 200,
        tap_5000: 5000,
        tap_50000: 100000,
        earn_10k: 5000,
        earn_100k: 30000,
        earn_10m: 1000000,
        earn_100m: 20000000,
        earn_1t: 1000000000,
        earn_1qa: 100000000000,
        buy_world_1: 50000,
        buy_world_2: 500000,
        buy_world_3: 5000000,
        buy_world_4: 50000000,
        buy_world_5: 500000000,
        buy_world_6: 5000000000,
        buy_world_7: 50000000000,
        buy_world_8: 500000000000,
        buy_world_9: 5000000000000,
        prod_1: 1000,
        prod_1k: 100000,
        prod_1m: 10000000,
        first_prestige: 500000000,
        prestige_5: 50000000000,
        streak_3: 5000,
        streak_14: 50000,
        streak_30: 500000,
        combo_1: 500,
        combo_20: 50000,
        upgrades_10: 2000,
        upgrades_50: 20000,
        upgrades_200: 200000,
        skugga_1: 1000,
        skugga_5: 10000,
      }
      const reward = ACHIEVEMENT_REWARDS[action.achievementId] ?? 0
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.achievementId],
        dollars: state.dollars + reward,
        totalEarned: state.totalEarned + reward,
      }
    }

    case 'PRESTIGE': {
      const newPrestige = (state.prestige ?? 0) + 1
      const newMultiplier = 1 + newPrestige * 0.35  // +35% per prestige
      return {
        ...state,
        // Keep: achievements, streak, stats, prestige count
        prestige: newPrestige,
        prestigeMultiplier: newMultiplier,
        // Reset: dollars, world, upgrades
        currentWorldId: 0,
        dollars: 0,
        totalEarned: 0,
        purchasedWorlds: [0],
        activeBoosts: [],
        worldProgress: WORLDS.map(w => ({
          worldId: w.id,
          upgrades: w.upgrades.map(u => ({ id: u.id, count: 0 })),
          totalEarnedInWorld: 0,
        })),
        worldCompletionBonuses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lastSavedAt: Date.now(),
      }
    }

    case 'RESET_GAME': {
      return {
        version: 1,
        currentWorldId: 0,
        dollars: 0,
        totalEarned: 0,
        worldProgress: [],
        dailyReward: { lastClaimedDate: null, streak: 0, claimedToday: false },
        unlockedAchievements: [],
        activeBoosts: [],
        stats: { totalTimePlayed: 0, totalTaps: 0, totalUpgradesPurchased: 0, skuggaSightings: 0, combosActivated: 0 },
        lastSavedAt: Date.now(),
        worldCompletionBonuses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        skuggaLastAppeared: 0,
        purchasedWorlds: [0],
        prestige: 0,
        prestigeMultiplier: 1,
      }
    }

    default:
      return state
  }
}
