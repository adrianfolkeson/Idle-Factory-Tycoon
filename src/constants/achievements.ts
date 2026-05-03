import { GameState } from '../types'

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
]
