import { GameState } from '../types'
import { computeProductionRate } from '../lib/gameEngine'

export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  check: (state: GameState) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_buy',
    name: 'Första Köpet',
    description: 'Köp din första uppgradering',
    icon: 'wrench',
    check: (s) => s.stats.totalUpgradesPurchased >= 1,
  },
  {
    id: 'tap_100',
    name: 'Finger av Järn',
    description: 'Klicka 100 gånger',
    icon: 'hand',
    check: (s) => s.stats.totalTaps >= 100,
  },
  {
    id: 'tap_1000',
    name: 'Klick-maskin',
    description: 'Klicka 1 000 gånger',
    icon: 'bolt',
    check: (s) => s.stats.totalTaps >= 1000,
  },
  {
    id: 'earn_1k',
    name: 'Tusen-ären',
    description: 'Tjäna totalt $1 000',
    icon: 'coin',
    check: (s) => s.totalEarned >= 1000,
  },
  {
    id: 'earn_1m',
    name: 'Miljonär!',
    description: 'Tjäna totalt $1 000 000',
    icon: 'coin',
    check: (s) => s.totalEarned >= 1000000,
  },
  {
    id: 'earn_1b',
    name: 'Miljardär!!',
    description: 'Tjäna totalt $1 000 000 000',
    icon: 'diamond',
    check: (s) => s.totalEarned >= 1000000000,
  },
  {
    id: 'world_1',
    name: 'Energimästare',
    description: 'Lås upp Energifabriken',
    icon: 'bolt',
    check: (s) => s.totalEarned >= 1000000,
  },
  {
    id: 'world_2',
    name: 'Lab-råtta',
    description: 'Lås upp Laboratoriet',
    icon: 'flask',
    check: (s) => s.totalEarned >= 10000000,
  },
  {
    id: 'world_3',
    name: 'Kosmisk Tycoon',
    description: 'Lås upp Rymdfabriken',
    icon: 'rocket',
    check: (s) => s.totalEarned >= 100000000,
  },
  {
    id: 'combo_5',
    name: 'Kombokung',
    description: 'Aktivera 5 kombinationer',
    icon: 'fire',
    check: (s) => s.stats.combosActivated >= 5,
  },
  {
    id: 'skugga_10',
    name: 'Skuggjägare',
    description: 'Få 10 besök av Skugga',
    icon: 'ghost',
    check: (s) => s.stats.skuggaSightings >= 10,
  },
  {
    id: 'streak_7',
    name: 'Lojal Fabrikör',
    description: 'Logga in 7 dagar i rad',
    icon: 'star',
    check: (s) => s.dailyReward.streak >= 7,
  },

  // ── More tap milestones ──
  { id: 'tap_500',   name: 'Tumme av stål',    description: 'Klicka 500 gånger',    icon: 'hand',    check: (s) => s.stats.totalTaps >= 500 },
  { id: 'tap_5000',  name: 'Clickinator',      description: 'Klicka 5 000 gånger',  icon: 'bolt',    check: (s) => s.stats.totalTaps >= 5000 },
  { id: 'tap_50000', name: 'Guds hand',         description: 'Klicka 50 000 gånger', icon: 'crown',   check: (s) => s.stats.totalTaps >= 50000 },

  // ── More earn milestones ──
  { id: 'earn_10k',  name: 'Tiomiljonär',      description: 'Tjäna totalt $10 000',       icon: 'coin',    check: (s) => s.totalEarned >= 10000 },
  { id: 'earn_100k', name: 'Hundramiljonär',   description: 'Tjäna totalt $100 000',      icon: 'coin',    check: (s) => s.totalEarned >= 100000 },
  { id: 'earn_10m',  name: 'Pengakungen',      description: 'Tjäna totalt $10 000 000',   icon: 'coin',    check: (s) => s.totalEarned >= 10000000 },
  { id: 'earn_100m', name: 'Megaföretag',      description: 'Tjäna totalt $100 000 000',  icon: 'diamond', check: (s) => s.totalEarned >= 100000000 },
  { id: 'earn_1t',   name: 'Billon-Bosse',     description: 'Tjäna totalt $1 000 000 000 000', icon: 'diamond', check: (s) => s.totalEarned >= 1e12 },
  { id: 'earn_1qa',  name: 'Oändlig rikedom',  description: 'Tjäna totalt $1Qa',            icon: 'crown',   check: (s) => s.totalEarned >= 1e15 },

  // ── World purchase milestones ──
  { id: 'buy_world_1', name: 'Energitycoon',   description: 'Köp Energifabriken',         icon: 'bolt',    check: (s) => s.purchasedWorlds?.includes(1) ?? false },
  { id: 'buy_world_2', name: 'Vetenskapsman',  description: 'Köp Laboratoriet',            icon: 'flask',   check: (s) => s.purchasedWorlds?.includes(2) ?? false },
  { id: 'buy_world_3', name: 'Rymdfarare',     description: 'Köp Rymdfabriken',            icon: 'rocket',  check: (s) => s.purchasedWorlds?.includes(3) ?? false },
  { id: 'buy_world_4', name: 'Vikingakung',    description: 'Köp Vikingasmedjan',          icon: 'hammer',  check: (s) => s.purchasedWorlds?.includes(4) ?? false },
  { id: 'buy_world_5', name: 'Dinojägare',     description: 'Köp Dinoparken',              icon: 'bone',    check: (s) => s.purchasedWorlds?.includes(5) ?? false },
  { id: 'buy_world_6', name: 'Havsmonark',     description: 'Köp Djuphavsstation',         icon: 'wave',    check: (s) => s.purchasedWorlds?.includes(6) ?? false },
  { id: 'buy_world_7', name: 'Vulkanherre',    description: 'Köp Vulkanverket',            icon: 'fire',    check: (s) => s.purchasedWorlds?.includes(7) ?? false },
  { id: 'buy_world_8', name: 'Tempelrövare',   description: 'Köp Djungeltemplet',          icon: 'leaf',    check: (s) => s.purchasedWorlds?.includes(8) ?? false },
  { id: 'buy_world_9', name: 'Cyberpunk-kung', description: 'Köp Neo-Stockholm',           icon: 'circuit', check: (s) => s.purchasedWorlds?.includes(9) ?? false },

  // ── Production rate milestones ──
  { id: 'prod_1',    name: 'Passiv inkomst',   description: 'Nå $1/sek produktion',        icon: 'gear',    check: (s) => computeProductionRate(s) >= 1 },
  { id: 'prod_1k',   name: 'Fabriksmästare',   description: 'Nå $1 000/sek produktion',    icon: 'gear',    check: (s) => computeProductionRate(s) >= 1000 },
  { id: 'prod_1m',   name: 'Industrimagnaten',  description: 'Nå $1 000 000/sek produktion', icon: 'trophy', check: (s) => computeProductionRate(s) >= 1e6 },

  // ── Prestige ──
  { id: 'first_prestige', name: 'Pånyttfödelse',   description: 'Utför ditt första prestige',     icon: 'crown',   check: (s) => (s.prestige ?? 0) >= 1 },
  { id: 'prestige_5',     name: 'Evighetsresenär', description: 'Utför prestige 5 gånger',        icon: 'crown',   check: (s) => (s.prestige ?? 0) >= 5 },

  // ── Streak milestones ──
  { id: 'streak_3',  name: 'Trogen spelare',   description: 'Logga in 3 dagar i rad',      icon: 'star',    check: (s) => s.dailyReward.streak >= 3 },
  { id: 'streak_14', name: 'Fabriksfrälst',    description: 'Logga in 14 dagar i rad',     icon: 'star',    check: (s) => s.dailyReward.streak >= 14 },
  { id: 'streak_30', name: 'Bossens hjälte',   description: 'Logga in 30 dagar i rad',     icon: 'crown',   check: (s) => s.dailyReward.streak >= 30 },

  // ── Combo milestones ──
  { id: 'combo_1',   name: 'Kombostartare',    description: 'Aktivera din första kombination',   icon: 'bolt',    check: (s) => s.stats.combosActivated >= 1 },
  { id: 'combo_20',  name: 'Kombolegend',      description: 'Aktivera 20 kombinationer',         icon: 'fire',    check: (s) => s.stats.combosActivated >= 20 },

  // ── Upgrade count ──
  { id: 'upgrades_10',  name: 'Handlaren',     description: 'Köp totalt 10 uppgraderingar',   icon: 'gear',    check: (s) => s.stats.totalUpgradesPurchased >= 10 },
  { id: 'upgrades_50',  name: 'Uppgraderaren', description: 'Köp totalt 50 uppgraderingar',   icon: 'gear',    check: (s) => s.stats.totalUpgradesPurchased >= 50 },
  { id: 'upgrades_200', name: 'Shoppingkung',  description: 'Köp totalt 200 uppgraderingar',  icon: 'trophy',  check: (s) => s.stats.totalUpgradesPurchased >= 200 },

  // ── Skugga ──
  { id: 'skugga_1', name: 'Spökjägare',        description: 'Få ditt första Skugga-besök',   icon: 'ghost',   check: (s) => s.stats.skuggaSightings >= 1 },
  { id: 'skugga_5', name: 'Spökbesatt',         description: 'Få 5 besök av Skugga',          icon: 'ghost',   check: (s) => s.stats.skuggaSightings >= 5 },
]
