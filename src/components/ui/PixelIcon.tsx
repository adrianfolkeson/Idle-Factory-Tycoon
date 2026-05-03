import React from 'react'
import { View } from 'react-native'

function shift(hex: string, amt: number): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16)
    const c = (ch: number) => Math.min(255, Math.max(0, ch + amt))
    return `rgb(${c((n >> 16) & 0xff)},${c((n >> 8) & 0xff)},${c(n & 0xff)})`
  } catch { return hex }
}

// Fixed palette — not affected by color prop
const PAL: Record<string, string> = {
  W: '#FFFFFF',
  K: '#111111',
  R: '#FF3030',
  O: '#FF8800',
  Y: '#FFD700',
  G: '#888888',
  N: '#333333',
  C: '#00DDFF',
  P: '#AA44FF',
}

// 8×8 pixel grids
// . = transparent   A = color prop   B = lighter A   D = darker A
const ICONS: Record<string, string[]> = {

  // ── Tab bar ──────────────────────────────────────────────────────────────
  factory: [
    '.AA.....',
    '.AA.....',
    'AAAAAAAA',
    'ADADADAD',
    'AAAAAAAA',
    'ADADADAD',
    'AAAAAAAA',
    'A..AA...',
  ],
  gear: [
    '.A.AA.A.',
    'AAAAAAAA',
    'AA.DD.AA',
    'A.DDDD.A',
    'A.DDDD.A',
    'AA.DD.AA',
    'AAAAAAAA',
    '.A.AA.A.',
  ],
  globe: [
    '.AAAAAA.',
    'AADAADAA',
    'AAAAAAAA',
    'DDDDDDDD',
    'AAAAAAAA',
    'AADAADAA',
    '.AAAAAA.',
    '...AA...',
  ],
  trophy: [
    'A.AAAA.A',
    'AAAAAAAA',
    '.AAAAAA.',
    '..AAAA..',
    '...AA...',
    '...AA...',
    '..AAAA..',
    '.AAAAAA.',
  ],

  // ── World icons ───────────────────────────────────────────────────────────
  bolt: [
    '..AAAAA.',
    '.AAAA...',
    'AAAA....',
    '.AAAAAAA',
    '..AAAAA.',
    '...AAA..',
    '....AA..',
    '.....A..',
  ],
  flask: [
    '..AAA...',
    '..AAA...',
    '..AAA...',
    '.AADAA..',
    '.AADAA..',
    'AAAAAAA.',
    'AAAAAAA.',
    '.AAAAA..',
  ],
  rocket: [
    '...AA...',
    '..AAAA..',
    '.AAAAAA.',
    '.AADAAA.',
    '.AAAAAA.',
    '.AAAAAA.',
    'AA.AA.AA',
    '........',
  ],

  // ── UI icons ─────────────────────────────────────────────────────────────
  lock: [
    '..AAAA..',
    '.A....A.',
    '.A....A.',
    'AAAAAAAA',
    'AAD.AAAA',
    'AADAAAAA',
    'AAAAAAAA',
    'AAAAAAAA',
  ],
  coin: [
    '.AAAAAA.',
    'AAAAAAAA',
    'ABBAADAA',
    'ABAAADAA',
    'ABAAADAA',
    'ABBAADAA',
    'AAAAAAAA',
    '.AAAAAA.',
  ],
  star: [
    '...AA...',
    'AAAAAAAA',
    '.AAAAAA.',
    '..AAAA..',
    '.A.AA.A.',
    'A..AA..A',
    '..A..A..',
    '........',
  ],
  ghost: [
    '.AAAAAA.',
    'AAAAAAAA',
    'ADAADAAA',
    'AAAAAAAA',
    'AAAAAAAA',
    'A.A.A.A.',
    '........',
    '........',
  ],
  fire: [
    '...RR...',
    '..RROO..',
    '.RROOO..',
    'RROOOOY.',
    'ROOOYYY.',
    '.ROYYY..',
    '..OYYY..',
    '...YY...',
  ],
  gift: [
    '..A.A...',
    '..AAA...',
    'AAAAAAAA',
    '.A.AA.A.',
    '.AAAAAA.',
    '.AAAAAA.',
    '.AAAAAA.',
    '.AAAAAA.',
  ],
  wrench: [
    '.A...AA.',
    'AA...AAA',
    '.AA.AAA.',
    '..AAAA..',
    '.AAAA...',
    '.AAA....',
    'AA......',
    'A.......',
  ],
  diamond: [
    '..AAAA..',
    '.AAAAAA.',
    'AAAAAAAA',
    '.AAAAAA.',
    '..AAAA..',
    '...AAA..',
    '....AA..',
    '........',
  ],
  hand: [
    '...AA...',
    '...AA...',
    '...AA...',
    '.AAAAAA.',
    'AAAAAAAA',
    'AAAAAAAA',
    '.AAAAAA.',
    '........',
  ],
  box: [
    '.AAAAAA.',
    'AAAAAAAA',
    'ABBBBBBA',
    'AAAAAAAA',
    'ADAAAADA',
    'AAAAAAAA',
    'AAAAAAAA',
    '.AAAAAA.',
  ],
  trash: [
    '.AAAAA..',
    'AAAAAAAA',
    '.AAAAAA.',
    '.A.A.A..',
    '.A.A.A..',
    '.A.A.A..',
    '.AAAAAA.',
    '........',
  ],
  warning: [
    '...AA...',
    '..AAAA..',
    '..ADAA..',
    '.AADAAA.',
    '.AADAAA.',
    'AAAAAAAA',
    'AAAAAAAA',
    '........',
  ],
  check: [
    '......AA',
    '.....AAA',
    '....AAA.',
    'A..AAA..',
    'AAAAA...',
    '.AAAA...',
    '..AAA...',
    '...A....',
  ],
  crown: [
    'A..A..A.',
    'AAAAAAAA',
    'ABBBBBBA',
    '.AAAAAA.',
    '.AAAAAA.',
    '.AAAAAA.',
    '.AAAAAA.',
    'AAAAAAAA',
  ],
  // ── New world icons ───────────────────────────────────────────────────────────
  hammer: [
    '.AAAAAAA',
    '.AAAAAAA',
    '.AAAAAAA',
    '..AA....',
    '..AA....',
    '..AA....',
    '..AA....',
    '..AA....',
  ],
  bone: [
    'AA....AA',
    'AAAAAAAA',
    'AAAAAAAA',
    'AA....AA',
    '........',
    '........',
    '........',
    '........',
  ],
  wave: [
    '...AA...',
    '..AAAA..',
    '.AAAAAA.',
    'AAAAAAAA',
    'AAAAAAAA',
    '.AAAAAA.',
    '..AAAA..',
    '...AA...',
  ],
  leaf: [
    '....AA..',
    '...AAA..',
    '..AAAAA.',
    '.AAADAA.',
    '.AAADAA.',
    '..AAAD..',
    '...AAD..',
    '....A...',
  ],
  circuit: [
    'A.A.A.A.',
    'AAAAAAAA',
    'A.....A.',
    'A.AAA.A.',
    'A.A.A.A.',
    'AAAAAAAA',
    'A.....A.',
    'A.A.A.A.',
  ],

  arrow_up: [
    '...AA...',
    '..AAAA..',
    '.AAAAAA.',
    'AAAAAAAA',
    '...AA...',
    '...AA...',
    '...AA...',
    '...AA...',
  ],
  settings: [
    '...AA...',
    '..AAAA..',
    'AAAAAAAA',
    '..AAAA..',
    '...AA...',
    '..AAAA..',
    'AAAAAAAA',
    '..AAAA..',
  ],
}

interface Props {
  name: string
  size?: number
  color?: string
}

export default function PixelIcon({ name, size = 16, color = '#FFB800' }: Props) {
  const grid = ICONS[name]
  if (!grid) return null
  const cols = grid[0]?.length ?? 8
  const ps = size / cols

  const resolve = (ch: string): string | undefined => {
    if (ch === '.') return undefined
    if (ch === 'A') return color
    if (ch === 'B') return shift(color, 55)
    if (ch === 'D') return shift(color, -45)
    return PAL[ch]
  }

  return (
    <View style={{ width: size, height: size }}>
      {grid.map((row, y) => (
        <View key={y} style={{ flexDirection: 'row', height: ps }}>
          {row.split('').map((ch, x) => (
            <View key={x} style={{ width: ps, height: ps, backgroundColor: resolve(ch) }} />
          ))}
        </View>
      ))}
    </View>
  )
}
