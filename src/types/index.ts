export interface UpgradeDef {
  id: string
  worldId: number
  name: string
  description: string
  baseCost: number
  baseProduction: number
  clickBonus: number
}

export interface WorldTheme {
  primary: string
  secondary: string
  accent: string
  sky: string
  ground: string
  buildingTop: string
  buildingBody: string
  windowColor: string
}

export interface WorldDef {
  id: number
  name: string
  icon: string
  product: string
  description: string
  unlockCost: number
  theme: WorldTheme
  upgrades: UpgradeDef[]
}

export interface UpgradeState {
  id: string
  count: number
}

export interface WorldProgress {
  worldId: number
  upgrades: UpgradeState[]
  totalEarnedInWorld: number
}

export interface DailyRewardState {
  lastClaimedDate: string | null
  streak: number
  claimedToday: boolean
}

export interface ActiveBoost {
  id: string
  multiplier: number
  expiresAt: number
}

export interface GameStats {
  totalTimePlayed: number
  totalTaps: number
  totalUpgradesPurchased: number
  skuggaSightings: number
  combosActivated: number
}

export interface GameState {
  version: number
  currentWorldId: number
  dollars: number
  totalEarned: number
  worldProgress: WorldProgress[]
  dailyReward: DailyRewardState
  unlockedAchievements: string[]
  activeBoosts: ActiveBoost[]
  stats: GameStats
  lastSavedAt: number
  worldCompletionBonuses: number[]
  skuggaLastAppeared: number
  purchasedWorlds: number[]
  prestige: number
  prestigeMultiplier: number
}

export type GameAction =
  | { type: 'TAP'; clickValue: number }
  | { type: 'TICK'; earnings: number; deltaMs: number }
  | { type: 'GAME_TICK'; earnings: number; deltaMs: number; checkAch: boolean }
  | { type: 'BUY_UPGRADE'; upgradeId: string; cost: number }
  | { type: 'BUY_UPGRADE_N'; upgradeId: string; n: number }
  | { type: 'SWITCH_WORLD'; worldId: number }
  | { type: 'CLAIM_DAILY_REWARD'; reward: DailyRewardPayload }
  | { type: 'APPLY_OFFLINE_EARNINGS'; amount: number }
  | { type: 'ADD_BOOST'; boost: ActiveBoost }
  | { type: 'EXPIRE_BOOSTS' }
  | { type: 'SKUGGA_APPEARED' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'COMBO_ACTIVATED' }
  | { type: 'PURCHASE_WORLD'; worldId: number; cost: number }
  | { type: 'PRESTIGE' }
  | { type: 'LOAD_SAVE'; state: GameState }
  | { type: 'TICK_STATS'; deltaMs: number }
  | { type: 'RESET_GAME' }

export type DailyRewardPayload =
  | { kind: 'cash'; amount: number }
  | { kind: 'boost'; multiplier: number; durationMs: number }
