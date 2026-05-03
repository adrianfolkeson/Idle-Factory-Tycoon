// Detect device locale — works in Hermes without any extra package
const locale = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().locale }
  catch { return 'en' }
})()

export const isSv = locale.startsWith('sv')

type Strings = typeof EN
const EN = {
  // Tab bar
  tabFactory:   'Factory',
  tabUpgrades:  'Upgrades',
  tabWorlds:    'Worlds',
  tabStats:     'Stats',

  // Factory screen
  click:        'CLICK!',
  combo:        'COMBO 2x',
  perClick:     '/click',
  passiveRate:  'passive',
  nudge:        'Buy an upgrade for passive income!',
  watchAd:      'WATCH AD',
  watchAdSub:   '3x bonus for 1 min',
  adCooldown:   'Ad ready in',
  adTitle:      'Advertisement',
  adBody:       'Watch a short ad to get a 3x production bonus for 1 minute.',
  adWatch:      'WATCH (5s)',
  adWatching:   'Watching...',
  adClaim:      'CLAIM 3x BONUS',
  adThanks:     '3x BONUS ACTIVE!',

  // Upgrades
  upgrades:     'UPGRADES',
  buy:          'BUY',
  buyNow:       'BUY NOW',
  perUnit:      '/unit',
  total:        'Total:',
  auto:         'auto',

  // Worlds
  worlds:       'WORLDS',
  buyFactory:   'BUY FOR',
  active:       'ACTIVE',
  switchTo:     'SWITCH TO',
  working:      'You are working here!',
  tier:         'Tier',

  // Stats
  statistics:   'STATISTICS',
  achievements: 'ACHIEVEMENTS',
  settings:     'SETTINGS',
  dailyReward:  'Daily reward',
  resetGame:    'Reset game',
  totalEarned:  'Total earned',
  timePlayed:   'Time played',
  totalClicks:  'Total clicks',
  totalUpgrades:'Upgrades',
  skugga:       'Skugga visits',
  combos:       'Combos',
  streak:       'Day streak',
  streakUnit:   'days',

  // Boosts
  boost2x:      '2x COMBO',
  boostGhost:   '+10%',

  // Modals
  dailyTitle:    'DAILY REWARD',
  dailyStreak:   'day streak!',
  dayLabel:      'Day',
  todayReward:   "TODAY'S REWARD",
  claim:         'CLAIM!',
  later:         'Later...',
  achievementLabel: 'ACHIEVEMENT!',
  offlineTitle:  'Welcome back!',
  offlineBody:   'You earned while away:',
  offlineClaim:  'COLLECT',

  // Daily reward labels
  dayLabels:     ['Box', 'Energy', 'Coins', 'Fire', 'Bonus', 'Star', 'Trophy'],
}

const SV: Strings = {
  tabFactory:   'Fabrik',
  tabUpgrades:  'Uppgradera',
  tabWorlds:    'Världar',
  tabStats:     'Stats',

  click:        'KLICKA!',
  combo:        'KOMBO 2x',
  perClick:     '/klick',
  passiveRate:  'passivt',
  nudge:        'Köp uppgradering för passiv inkomst!',
  watchAd:      'SE REKLAM',
  watchAdSub:   '3x bonus i 1 min',
  adCooldown:   'Reklam om',
  adTitle:      'Reklam',
  adBody:       'Titta på en kort reklam och få 3x produktionsbonus i 1 minut.',
  adWatch:      'TITTA (5s)',
  adWatching:   'Tittar...',
  adClaim:      'HÄMTA 3x BONUS',
  adThanks:     '3x BONUS AKTIV!',

  upgrades:     'UPPGRADERINGAR',
  buy:          'KÖP',
  buyNow:       'KÖP NU',
  perUnit:      '/enhet',
  total:        'Totalt:',
  auto:         'auto',

  worlds:       'VÄRLDAR',
  buyFactory:   'KÖP FÖR',
  active:       'AKTIV',
  switchTo:     'BYTA TILL',
  working:      'Du jobbar här just nu!',
  tier:         'Nivå',

  statistics:   'STATISTIK',
  achievements: 'ACHIEVEMENTS',
  settings:     'INSTÄLLNINGAR',
  dailyReward:  'Daglig belöning',
  resetGame:    'Återställ spel',
  totalEarned:  'Totalt tjänat',
  timePlayed:   'Tid spelad',
  totalClicks:  'Totala klick',
  totalUpgrades:'Uppgraderingar',
  skugga:       'Skugga-besök',
  combos:       'Kombos',
  streak:       'Dagars streak',
  streakUnit:   'dagar',

  boost2x:      '2x KOMBO',
  boostGhost:   '+10%',

  dailyTitle:    'DAGLIG BELÖNING',
  dailyStreak:   'dagars streak!',
  dayLabel:      'Dag',
  todayReward:   'DAGENS BELÖNING',
  claim:         'HÄMTA!',
  later:         'Senare...',
  achievementLabel: 'ACHIEVEMENT!',
  offlineTitle:  'Välkommen tillbaka!',
  offlineBody:   'Du tjänade medan du var borta:',
  offlineClaim:  'HÄMTA',

  dayLabels:     ['Låda', 'Energi', 'Mynt', 'Eld', 'Bonus', 'Stjärna', 'Trofé'],
}

export const s: Strings = isSv ? SV : EN
