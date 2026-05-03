import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'

const { width: SW, height: SH } = Dimensions.get('window')

// ─── Shared animation helpers ──────────────────────────────────────────────────

function useLoop(from: number, to: number, duration: number, delay = 0) {
  const val = useRef(new Animated.Value(from)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(val, { toValue: to,   duration, useNativeDriver: true }),
      Animated.timing(val, { toValue: from, duration, useNativeDriver: true }),
    ])).start()
  }, [])
  return val
}

function useLoopNonNative(from: number, to: number, duration: number, delay = 0) {
  const val = useRef(new Animated.Value(from)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(val, { toValue: to,   duration, useNativeDriver: false }),
      Animated.timing(val, { toValue: from, duration, useNativeDriver: false }),
    ])).start()
  }, [])
  return val
}

// ════════════════════════════════════════════════════════════════
// WORLD 1 — ENERGY FACTORY
// ════════════════════════════════════════════════════════════════
function EnergyCoil({ x, y, color }: { x: number; y: number; color: string }) {
  const arc = useLoop(0, 1, 400 + Math.random() * 300)
  return (
    <View style={{ position: 'absolute', top: y, left: x }}>
      <View style={{ width: 8, height: 40, backgroundColor: '#333', borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Animated.View style={{ position: 'absolute', top: 2, left: -12, width: 24, height: 4, borderRadius: 2, backgroundColor: color, opacity: arc, shadowColor: color, shadowOpacity: 1, shadowRadius: 8 }} />
    </View>
  )
}

export function EnergyScene({ accent }: { accent: string }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <EnergyCoil x={20}  y={60} color={accent} />
      <EnergyCoil x={SW - 40} y={70} color={accent} />
      <EnergyCoil x={SW * 0.45} y={50} color={accent} />
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 2 — LAB
// ════════════════════════════════════════════════════════════════
export function LabScene({ accent }: { accent: string }) {
  const scanLine = useRef(new Animated.Value(-10)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(scanLine, { toValue: SH * 0.6, duration: 3000, useNativeDriver: true })
    ).start()
  }, [])
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Holographic scan line */}
      <Animated.View style={{ position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: accent, opacity: 0.25, transform: [{ translateY: scanLine }] }} />
      {/* Lab grid on walls */}
      {[...Array(6)].map((_, i) => (
        <View key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * (SW / 6), width: 1, backgroundColor: accent, opacity: 0.08 }} />
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 3 — SPACE ESCAPE POD
// ════════════════════════════════════════════════════════════════

const WIN_W = SW * 0.84
const WIN_H = SH * 0.38
const WIN_TOP = 44

// Seeded stable random
function sr(seed: number) { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x) }

function WindowStar({ i }: { i: number }) {
  const op = useRef(new Animated.Value(sr(i * 7.3))).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(sr(i * 3.1) * 3000),
      Animated.timing(op, { toValue: 0.1, duration: 600 + sr(i) * 800, useNativeDriver: true }),
      Animated.timing(op, { toValue: 1,   duration: 600 + sr(i * 2) * 800, useNativeDriver: true }),
    ])).start()
  }, [])
  const size = sr(i * 11) > 0.85 ? 3 : sr(i * 5) > 0.7 ? 2 : 1
  return (
    <Animated.View style={{
      position: 'absolute',
      top: sr(i * 4.7) * WIN_H,
      left: sr(i * 6.3) * WIN_W,
      width: size, height: size, borderRadius: size,
      backgroundColor: sr(i * 9) > 0.9 ? '#FFEEAA' : sr(i * 13) > 0.8 ? '#AACCFF' : '#FFFFFF',
      opacity: op,
    }} />
  )
}

type SpaceObjType = 'planet_purple' | 'planet_blue' | 'planet_red' | 'earth' | 'moon' | 'sun' | 'nebula'

const SPACE_OBJS: SpaceObjType[] = [
  'planet_purple', 'earth', 'moon', 'planet_blue', 'sun',
  'planet_red', 'nebula', 'planet_purple', 'moon', 'earth',
]

function SpaceObject({ idx }: { idx: number }) {
  const type = SPACE_OBJS[idx % SPACE_OBJS.length]
  const fromRight = idx % 2 === 0
  const x = useRef(new Animated.Value(fromRight ? WIN_W + 120 : -120)).current
  const y = WIN_H * (0.15 + sr(idx * 3.7) * 0.6)
  const speed = 18000 + sr(idx * 5.1) * 14000
  const interval = 8000 + idx * 5000

  useEffect(() => {
    const cycle = () => {
      x.setValue(fromRight ? WIN_W + 120 : -120)
      Animated.sequence([
        Animated.delay(interval + sr(idx) * 4000),
        Animated.timing(x, {
          toValue: fromRight ? -120 : WIN_W + 120,
          duration: speed,
          useNativeDriver: true,
        }),
      ]).start(cycle)
    }
    cycle()
  }, [])

  const renderObj = () => {
    switch (type) {
      case 'earth':
        return (
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#1A5A8A', overflow: 'hidden', shadowColor: '#4488FF', shadowOpacity: 0.6, shadowRadius: 12 }}>
            <View style={{ position: 'absolute', top: 8,  left: 10, width: 28, height: 20, backgroundColor: '#2A8A3A', borderRadius: 6 }} />
            <View style={{ position: 'absolute', top: 30, left: 22, width: 22, height: 14, backgroundColor: '#2A8A3A', borderRadius: 5 }} />
            <View style={{ position: 'absolute', top: 4,  left: 30, width: 14, height: 10, backgroundColor: '#2A8A3A', borderRadius: 4 }} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 30 }} />
          </View>
        )
      case 'moon':
        return (
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#8A8A7A', overflow: 'hidden', shadowColor: '#FFFFFF', shadowOpacity: 0.3, shadowRadius: 8 }}>
            {[{ t: 8, l: 6, s: 10 }, { t: 20, l: 24, s: 8 }, { t: 6, l: 28, s: 6 }, { t: 28, l: 8, s: 7 }].map((c, i) => (
              <View key={i} style={{ position: 'absolute', top: c.t, left: c.l, width: c.s, height: c.s, borderRadius: c.s / 2, backgroundColor: '#6A6A5A' }} />
            ))}
          </View>
        )
      case 'sun':
        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFD700', shadowColor: '#FFAA00', shadowOpacity: 1, shadowRadius: 30, elevation: 10 }}>
              <View style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, borderRadius: 29, backgroundColor: '#FFEE44' }} />
              {/* Solar flares */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <View key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: 20, height: 4, backgroundColor: '#FFA500', borderRadius: 2, opacity: 0.7,
                  transform: [{ rotate: `${deg}deg` }, { translateX: 28 }, { translateY: -2 }] }} />
              ))}
            </View>
          </View>
        )
      case 'planet_purple':
        return (
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#6A2A8A', overflow: 'hidden', shadowColor: '#AA44FF', shadowOpacity: 0.5, shadowRadius: 10 }}>
            <View style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 8, backgroundColor: 'rgba(255,200,255,0.15)' }} />
            <View style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 5, backgroundColor: 'rgba(255,200,255,0.10)' }} />
          </View>
        )
      case 'planet_blue':
        return (
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A3A8A', overflow: 'hidden', shadowColor: '#4488FF', shadowOpacity: 0.5, shadowRadius: 8 }}>
            <View style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 5, backgroundColor: 'rgba(200,220,255,0.2)' }} />
            <View style={{ position: 'absolute', top: 22, left: 0, right: 0, height: 4, backgroundColor: 'rgba(200,220,255,0.15)' }} />
          </View>
        )
      case 'planet_red':
        return (
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#8A2A1A', overflow: 'hidden', shadowColor: '#FF4422', shadowOpacity: 0.4, shadowRadius: 8 }}>
            <View style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 6, backgroundColor: 'rgba(255,180,150,0.15)' }} />
            <View style={{ position: 'absolute', top: 26, left: 8, width: 18, height: 4, backgroundColor: 'rgba(200,80,60,0.4)', borderRadius: 2 }} />
          </View>
        )
      case 'nebula':
        return (
          <View style={{ width: 90, height: 55, borderRadius: 28, backgroundColor: 'transparent', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#2A0A4A', opacity: 0.6, borderRadius: 28 }} />
            <View style={{ position: 'absolute', top: 5, left: 10, width: 50, height: 30, backgroundColor: '#6A0088', opacity: 0.4, borderRadius: 20 }} />
            <View style={{ position: 'absolute', top: 15, left: 30, width: 40, height: 25, backgroundColor: '#0044AA', opacity: 0.35, borderRadius: 18 }} />
            <View style={{ position: 'absolute', top: 8, left: 5, width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFF' }} />
            <View style={{ position: 'absolute', top: 20, left: 50, width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFF' }} />
          </View>
        )
      default: return null
    }
  }

  return (
    <Animated.View style={{ position: 'absolute', top: y, transform: [{ translateX: x }] }}>
      {renderObj()}
    </Animated.View>
  )
}

function ZeroGDust({ index }: { index: number }) {
  const xPos = sr(index * 17.3 + 5) * SW   // stable static position
  const y = useLoop(-5, 5, 3000 + sr(index * 7.1) * 2000, sr(index * 3.3) * 2000)
  return (
    <Animated.View style={{
      position: 'absolute', top: '60%', left: xPos,
      width: 2, height: 2, borderRadius: 1,
      backgroundColor: '#AAAAAA', opacity: 0.3,
      transform: [{ translateY: y }],
    }} />
  )
}

export function SpaceEscapePodScene({ accent, active }: { accent: string; active: boolean }) {
  const warningFlash = useLoop(0.2, 0.8, 800)
  const ledGlow = useLoop(0.4, 0.9, 1200)

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* ── Pod interior background ── */}
      <View style={{ flex: 1, backgroundColor: '#0D0D18' }} />

      {/* ── THE BIG WINDOW ── */}
      <View style={{
        position: 'absolute',
        top: WIN_TOP, left: (SW - WIN_W) / 2,
        width: WIN_W, height: WIN_H,
        backgroundColor: '#000008',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 8, borderColor: '#2A2A3A',
      }}>
        {/* Star field */}
        {Array.from({ length: 22 }, (_, i) => <WindowStar key={i} i={i} />)}
        {/* Drifting space objects */}
        {Array.from({ length: 4 }, (_, i) => <SpaceObject key={i} idx={i} />)}
        {/* Subtle space gradient */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: WIN_H * 0.3, backgroundColor: 'rgba(10,5,30,0.4)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: WIN_H * 0.2, backgroundColor: 'rgba(5,5,20,0.5)' }} />
      </View>

      {/* ── Window frame / hull ── */}
      {/* Top hull beam */}
      <View style={{ position: 'absolute', top: WIN_TOP - 12, left: 0, right: 0, height: 20, backgroundColor: '#1A1A28', borderBottomWidth: 2, borderBottomColor: '#333344' }}>
        {/* Bolts */}
        {[SW*0.08, SW*0.22, SW*0.38, SW*0.52, SW*0.68, SW*0.82].map((x, i) => (
          <View key={i} style={{ position: 'absolute', top: 7, left: x, width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A4A' }} />
        ))}
        {/* Warning light */}
        <Animated.View style={{ position: 'absolute', top: 5, right: 20, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF2200', opacity: warningFlash }} />
        {/* LED strip */}
        <Animated.View style={{ position: 'absolute', bottom: 0, left: (SW - WIN_W) / 2, width: WIN_W, height: 3, backgroundColor: accent, opacity: ledGlow }} />
      </View>
      {/* Left hull wall */}
      <View style={{ position: 'absolute', top: WIN_TOP, left: 0, width: (SW - WIN_W) / 2, height: WIN_H, backgroundColor: '#141420' }}>
        <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#2A2A3A' }} />
        {/* Wall panel details */}
        {[20, 60, 100].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 4, right: 8, height: 24, backgroundColor: '#1A1A2A', borderWidth: 1, borderColor: '#2A2A3A', borderRadius: 2 }} />
        ))}
        {/* Bolts on frame */}
        {[8, WIN_H - 12].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, right: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A4A' }} />
        ))}
      </View>
      {/* Right hull wall */}
      <View style={{ position: 'absolute', top: WIN_TOP, right: 0, width: (SW - WIN_W) / 2, height: WIN_H, backgroundColor: '#141420' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#2A2A3A' }} />
        {[30, 70, 110].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 8, right: 4, height: 24, backgroundColor: '#1A1A2A', borderWidth: 1, borderColor: '#2A2A3A', borderRadius: 2 }} />
        ))}
        {[8, WIN_H - 12].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A4A' }} />
        ))}
      </View>
      {/* Bottom hull beam (below window) */}
      <View style={{
        position: 'absolute',
        top: WIN_TOP + WIN_H,
        left: 0, right: 0, height: 16,
        backgroundColor: '#1A1A28',
        borderTopWidth: 2, borderTopColor: '#333344',
      }}>
        {[SW*0.1, SW*0.3, SW*0.5, SW*0.7, SW*0.9].map((x, i) => (
          <View key={i} style={{ position: 'absolute', top: 5, left: x, width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A4A' }} />
        ))}
      </View>

      {/* ── Pod floor / interior zone ── */}
      <View style={{
        position: 'absolute',
        top: WIN_TOP + WIN_H + 16,
        left: 0, right: 0, bottom: 0,
        backgroundColor: '#0D0D18',
      }}>
        {/* Metal floor grating lines */}
        {[...Array(5)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: i * 14, left: 0, right: 0, height: 1, backgroundColor: '#2A2A3A', opacity: 0.5 }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i * (SW / 10), width: 1, backgroundColor: '#2A2A3A', opacity: 0.3 }} />
        ))}
        {/* Control panels on sides */}
        <View style={{ position: 'absolute', top: 8, left: 4, width: 40, height: 50, backgroundColor: '#1A1A2A', borderRadius: 3, borderWidth: 1, borderColor: '#3A3A4A' }}>
          {[0, 1, 2].map(i => <View key={i} style={{ position: 'absolute', top: 8 + i * 14, left: 6, width: 28, height: 8, backgroundColor: '#0A0A1A', borderRadius: 2 }}>
            <Animated.View style={{ position: 'absolute', top: 2, left: 2, width: 6, height: 4, borderRadius: 1, backgroundColor: i === 0 ? accent : i === 1 ? '#00FF88' : '#FF4444', opacity: ledGlow }} />
          </View>)}
        </View>
        <View style={{ position: 'absolute', top: 8, right: 4, width: 40, height: 50, backgroundColor: '#1A1A2A', borderRadius: 3, borderWidth: 1, borderColor: '#3A3A4A' }}>
          {[0, 1].map(i => <View key={i} style={{ position: 'absolute', top: 10 + i * 18, left: 6, width: 28, height: 10, backgroundColor: '#0A0A1A', borderRadius: 2 }}>
            <Animated.View style={{ position: 'absolute', top: 3, right: 4, width: 5, height: 4, borderRadius: 1, backgroundColor: i === 0 ? '#FFAA00' : '#00AAFF', opacity: warningFlash }} />
          </View>)}
        </View>
        {/* Floating dust particles */}
        {active && [0,1,2,3,4].map(i => <ZeroGDust key={i} index={i} />)}
      </View>

    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 3 — SPACE (ROCKET INTERIOR) — kept for overlay use
// ════════════════════════════════════════════════════════════════
function Porthole({ x, y }: { x: number; y: number }) {
  const twinkle = useLoop(0.4, 1, 1200, Math.random() * 800)
  return (
    <View style={{ position: 'absolute', top: y, left: x, width: 50, height: 50, borderRadius: 25, backgroundColor: '#000510', borderWidth: 6, borderColor: '#888', overflow: 'hidden' }}>
      {/* Stars inside porthole */}
      {[...Array(8)].map((_, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          top: Math.sin(i * 137.5) * 18 + 22,
          left: Math.cos(i * 137.5) * 18 + 22,
          width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1,
          borderRadius: 1, backgroundColor: '#FFF', opacity: twinkle,
        }} />
      ))}
      {/* Rim highlight */}
      <View style={{ position: 'absolute', top: 4, left: 4, width: 12, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
    </View>
  )
}

function FloatingItem({ x, y, color }: { x: number; y: number; color: string }) {
  const floatY = useLoop(-4, 4, 2000 + Math.random() * 1000, Math.random() * 1000)
  const rot = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(Animated.timing(rot, { toValue: 1, duration: 5000, useNativeDriver: true })).start()
  }, [])
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
  return (
    <Animated.View style={{ position: 'absolute', top: y, left: x, transform: [{ translateY: floatY }, { rotate }] }}>
      <View style={{ width: 14, height: 10, backgroundColor: color, borderRadius: 2, opacity: 0.7 }} />
    </Animated.View>
  )
}

export function SpaceRocketScene({ accent }: { accent: string }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Curved hull walls */}
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 18, backgroundColor: '#2A2A3A', borderRightWidth: 2, borderRightColor: '#444' }} />
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 18, backgroundColor: '#2A2A3A', borderLeftWidth: 2, borderLeftColor: '#444' }} />
      {/* Warning strips on hull */}
      {[0, 1].map(i => (
        <View key={i} style={{ position: 'absolute', top: 40 + i * 80, left: 0, width: 18, height: 8, backgroundColor: '#FFB800', opacity: 0.6 }} />
      ))}
      {/* Portholes */}
      <Porthole x={SW * 0.08} y={60} />
      <Porthole x={SW * 0.75} y={55} />
      <Porthole x={SW * 0.42} y={20} />
      {/* Floating items */}
      <FloatingItem x={SW * 0.3} y={100} color={accent} />
      <FloatingItem x={SW * 0.65} y={140} color="#FFFFFF" />
      {/* Hull bolts */}
      {[20, 50, 80, 130, 165].map((y, i) => (
        <React.Fragment key={i}>
          <View style={{ position: 'absolute', top: y, left: 14, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' }} />
          <View style={{ position: 'absolute', top: y, right: 14, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' }} />
        </React.Fragment>
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 4 — VIKING GREAT HALL
// ════════════════════════════════════════════════════════════════
function Torch({ x, y, active }: { x: number; y: number; active: boolean }) {
  const flicker = useLoop(0.6, 1, 120 + Math.random() * 80)
  const flicker2 = useLoop(0.8, 1, 90, 40)
  return (
    <View style={{ position: 'absolute', top: y, left: x }}>
      <View style={{ width: 6, height: 20, backgroundColor: '#5A3A14', borderRadius: 2 }} />
      {active && (
        <>
          <Animated.View style={{ position: 'absolute', top: -14, left: -4, width: 14, height: 18, borderRadius: 7, backgroundColor: '#FF6600', opacity: flicker }} />
          <Animated.View style={{ position: 'absolute', top: -10, left: -1, width: 8, height: 12, borderRadius: 4, backgroundColor: '#FFB800', opacity: flicker2 }} />
          <View style={{ position: 'absolute', top: -4, left: 1, width: 4, height: 6, borderRadius: 2, backgroundColor: '#FFEE88' }} />
        </>
      )}
    </View>
  )
}

function ForgeGlow({ active }: { active: boolean }) {
  const glow = useLoop(0.3, 0.9, 600)
  if (!active) return null
  return (
    <Animated.View style={{
      position: 'absolute', bottom: 0,
      left: SW * 0.35, right: SW * 0.35,
      height: 60, borderRadius: 30,
      backgroundColor: '#FF4400',
      opacity: glow,
      shadowColor: '#FF6600', shadowOpacity: 1, shadowRadius: 30,
    }} pointerEvents="none" />
  )
}

export function VikingScene({ active }: { active: boolean }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Wooden beam ceiling */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, backgroundColor: '#2A1A08' }}>
        {[SW * 0.15, SW * 0.4, SW * 0.65, SW * 0.88].map((x, i) => (
          <View key={i} style={{ position: 'absolute', top: 0, left: x, width: 16, height: 30, backgroundColor: '#1A0E04' }} />
        ))}
        {/* Diagonal crossing beams */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#1A0E04' }} />
      </View>
      {/* Log walls */}
      <View style={{ position: 'absolute', top: 30, left: 0, bottom: 0, width: 22 }}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ height: 22, backgroundColor: i % 2 === 0 ? '#3D2210' : '#4A2A14', borderBottomWidth: 1, borderBottomColor: '#1A0A04' }} />
        ))}
        {/* Shield on wall */}
        <View style={{ position: 'absolute', top: 40, left: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#C8860A', borderWidth: 3, borderColor: '#5A3A14' }}>
          <View style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#5A3A14' }} />
        </View>
      </View>
      <View style={{ position: 'absolute', top: 30, right: 0, bottom: 0, width: 22 }}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ height: 22, backgroundColor: i % 2 === 0 ? '#3D2210' : '#4A2A14', borderBottomWidth: 1, borderBottomColor: '#1A0A04' }} />
        ))}
        {/* Hanging pelt */}
        <View style={{ position: 'absolute', top: 30, left: 0, width: 22, height: 40, backgroundColor: '#6B4A2A', borderRadius: 3, opacity: 0.8 }} />
      </View>
      {/* Torches */}
      <Torch x={SW * 0.12} y={55} active={active} />
      <Torch x={SW * 0.82} y={55} active={active} />
      <Torch x={SW * 0.47} y={40} active={active} />
      {/* Forge glow from floor */}
      <ForgeGlow active={active} />
      {/* Rune carvings */}
      {[SW * 0.3, SW * 0.6].map((x, i) => (
        <View key={i} style={{ position: 'absolute', top: 100, left: x, width: 16, height: 30 }}>
          {[0, 1, 2].map(j => (
            <View key={j} style={{ width: 10 + (j % 2) * 4, height: 2, backgroundColor: '#C8860A', marginVertical: 4, opacity: 0.4 }} />
          ))}
        </View>
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 5 — DINO JUNGLE (OUTDOOR)
// ════════════════════════════════════════════════════════════════
function PalmTree({ x, height, trunkColor = '#5A3A14', leafColor = '#1A5A10' }: {
  x: number; height: number; trunkColor?: string; leafColor?: string
}) {
  const sway = useLoop(-3, 3, 2000 + Math.random() * 1000, Math.random() * 1000)
  return (
    <Animated.View style={{ position: 'absolute', bottom: 0, left: x, alignItems: 'center', transform: [{ rotate: sway.interpolate({ inputRange: [-3, 3], outputRange: ['-3deg', '3deg'] }) }], transformOrigin: 'bottom' }}>
      <View style={{ width: 12, height: height, backgroundColor: trunkColor, borderRadius: 4 }}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: height * 0.15 * i, left: 0, right: 0, height: 3, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        ))}
      </View>
      {/* Leaves */}
      <View style={{ position: 'absolute', top: -20, width: 60, height: 28, alignItems: 'center' }}>
        {[-50, -30, -15, 0, 15, 30, 50].map((rot, i) => (
          <View key={i} style={{ position: 'absolute', left: '50%', top: 0, width: 28, height: 8, backgroundColor: leafColor, borderRadius: 4, transform: [{ rotate: `${rot}deg` }, { translateX: -14 }], opacity: 0.9 }} />
        ))}
      </View>
    </Animated.View>
  )
}

function Bush({ x, size = 24, color = '#1A4A0A' }: { x: number; size?: number; color?: string }) {
  return (
    <View style={{ position: 'absolute', bottom: 0, left: x, flexDirection: 'row', gap: 0 }}>
      <View style={{ width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, backgroundColor: color, marginTop: size * 0.3 }} />
      <View style={{ width: size, height: size, borderRadius: size * 0.5, backgroundColor: color }} />
      <View style={{ width: size * 0.8, height: size * 0.6, borderRadius: size * 0.3, backgroundColor: color, marginTop: size * 0.4 }} />
    </View>
  )
}

function TRex() {
  const x = useRef(new Animated.Value(SW + 80)).current
  const nod = useLoop(-5, 5, 400, 200)
  useEffect(() => {
    const cycle = () => {
      x.setValue(SW + 80)
      Animated.sequence([
        Animated.delay(4000 + Math.random() * 6000),
        Animated.timing(x, { toValue: SW * 0.55, duration: 1200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(x, { toValue: SW + 80, duration: 1000, useNativeDriver: true }),
      ]).start(cycle)
    }
    cycle()
  }, [])
  const headRot = nod.interpolate({ inputRange: [-5, 5], outputRange: ['-5deg', '5deg'] })
  return (
    <Animated.View style={{ position: 'absolute', bottom: 30, transform: [{ translateX: x }] }}>
      {/* Body */}
      <View style={{ width: 50, height: 36, backgroundColor: '#4A7A28', borderRadius: 8, marginLeft: 10 }}>
        <View style={{ position: 'absolute', top: 4, left: 4, right: 4, height: 4, backgroundColor: '#3A6018', borderRadius: 2, opacity: 0.5 }} />
      </View>
      {/* Head */}
      <Animated.View style={{ position: 'absolute', top: -20, left: 20, transform: [{ rotate: headRot }] }}>
        <View style={{ width: 40, height: 22, backgroundColor: '#4A7A28', borderRadius: 4 }}>
          {/* Jaw */}
          <View style={{ position: 'absolute', bottom: -6, left: 4, width: 30, height: 10, backgroundColor: '#3A6018', borderRadius: 2 }}>
            {[0,1,2,3].map(i => (
              <View key={i} style={{ position: 'absolute', top: -3, left: 4 + i * 6, width: 3, height: 5, backgroundColor: '#EEEECC', borderRadius: 1 }} />
            ))}
          </View>
          {/* Eye */}
          <View style={{ position: 'absolute', top: 5, left: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4400' }}>
            <View style={{ position: 'absolute', top: 2, left: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: '#1A0000' }} />
          </View>
          {/* Nostril */}
          <View style={{ position: 'absolute', top: 8, left: 28, width: 4, height: 3, borderRadius: 2, backgroundColor: '#2A4A10' }} />
        </View>
      </Animated.View>
      {/* Tiny arms */}
      <View style={{ position: 'absolute', top: 4, left: 2, width: 10, height: 6, backgroundColor: '#3A6018', borderRadius: 3, transform: [{ rotate: '30deg' }] }} />
      {/* Legs */}
      <View style={{ flexDirection: 'row', gap: 8, marginLeft: 14, marginTop: 0 }}>
        <View style={{ width: 12, height: 20, backgroundColor: '#3A6018', borderRadius: 4 }} />
        <View style={{ width: 12, height: 22, backgroundColor: '#4A7A28', borderRadius: 4 }} />
      </View>
      {/* Tail */}
      <View style={{ position: 'absolute', bottom: 16, right: -20, width: 28, height: 10, backgroundColor: '#4A7A28', borderRadius: 5, transform: [{ rotate: '-15deg' }] }} />
    </Animated.View>
  )
}

function Pterodactyl() {
  const x = useRef(new Animated.Value(-60)).current
  const y = useRef(new Animated.Value(40)).current
  const wingFlap = useLoop(-8, 8, 300)
  useEffect(() => {
    const cycle = () => {
      x.setValue(-60)
      y.setValue(30 + Math.random() * 60)
      Animated.sequence([
        Animated.delay(3000 + Math.random() * 8000),
        Animated.parallel([
          Animated.timing(x, { toValue: SW + 60, duration: 3500, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(y, { toValue: 10, duration: 1000, useNativeDriver: true }),
            Animated.timing(y, { toValue: 50, duration: 2500, useNativeDriver: true }),
          ]),
        ]),
      ]).start(cycle)
    }
    cycle()
  }, [])
  const wing = wingFlap.interpolate({ inputRange: [-8, 8], outputRange: ['-8deg', '8deg'] })
  return (
    <Animated.View style={{ position: 'absolute', transform: [{ translateX: x }, { translateY: y }] }}>
      <View style={{ alignItems: 'center' }}>
        <Animated.View style={{ width: 30, height: 6, backgroundColor: '#6A4020', borderRadius: 3, transform: [{ rotate: wing }] }} />
        <View style={{ width: 10, height: 12, backgroundColor: '#7A5030', borderRadius: 3 }}>
          <View style={{ position: 'absolute', top: -8, left: 6, width: 14, height: 8, backgroundColor: '#6A4020', borderRadius: 2, transform: [{ rotate: '-30deg' }] }} />
        </View>
        <Animated.View style={{ width: 30, height: 6, backgroundColor: '#6A4020', borderRadius: 3, transform: [{ rotate: wingFlap.interpolate({ inputRange: [-8, 8], outputRange: ['8deg', '-8deg'] }) }] }} />
      </View>
    </Animated.View>
  )
}

function Raptor() {
  const x = useRef(new Animated.Value(-40)).current
  useEffect(() => {
    const cycle = () => {
      x.setValue(-40)
      Animated.sequence([
        Animated.delay(7000 + Math.random() * 10000),
        Animated.timing(x, { toValue: SW + 40, duration: 2200, useNativeDriver: true }),
      ]).start(cycle)
    }
    cycle()
  }, [])
  return (
    <Animated.View style={{ position: 'absolute', bottom: 45, transform: [{ translateX: x }] }}>
      <View style={{ width: 22, height: 18, backgroundColor: '#5A8A30', borderRadius: 4, marginLeft: 4 }} />
      <View style={{ position: 'absolute', top: -10, left: 8, width: 18, height: 12, backgroundColor: '#5A8A30', borderRadius: 3 }}>
        <View style={{ position: 'absolute', top: 3, left: 2, width: 5, height: 5, borderRadius: 3, backgroundColor: '#FF3300' }}>
          <View style={{ position: 'absolute', top: 1, left: 1, width: 3, height: 3, borderRadius: 2, backgroundColor: '#1A0000' }} />
        </View>
        <View style={{ position: 'absolute', top: -6, left: 10, width: 14, height: 8, backgroundColor: '#5A8A30', borderRadius: 2 }}>
          <View style={{ position: 'absolute', bottom: -2, left: 2, width: 2, height: 4, backgroundColor: '#EEEECC', borderRadius: 1 }} />
          <View style={{ position: 'absolute', bottom: -2, left: 6, width: 2, height: 3, backgroundColor: '#EEEECC', borderRadius: 1 }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 3, marginLeft: 4 }}>
        <View style={{ width: 8, height: 16, backgroundColor: '#4A7A28', borderRadius: 3 }} />
        <View style={{ width: 8, height: 14, backgroundColor: '#5A8A30', borderRadius: 3 }} />
      </View>
      <View style={{ position: 'absolute', bottom: 12, right: -12, width: 18, height: 8, backgroundColor: '#5A8A30', borderRadius: 4, transform: [{ rotate: '-20deg' }] }} />
    </Animated.View>
  )
}

export function DinoScene({ active }: { active: boolean }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Sky gradient */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: '#0A2A14' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: '#122A0A', opacity: 0.6 }} />
        {/* Sun glow */}
        <View style={{ position: 'absolute', top: 10, right: SW * 0.2, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFB800', opacity: 0.15 }} />
      </View>
      {/* Background treeline (far) */}
      {[0, 40, 90, 140, 200, 260, 310, 360].map((x, i) => (
        <View key={i} style={{ position: 'absolute', bottom: 50, left: x, width: 30 + (i % 3) * 10, height: 80 + (i % 4) * 20, backgroundColor: '#0A2A08', borderRadius: 4, opacity: 0.5 }} />
      ))}
      {/* Mid treeline */}
      <PalmTree x={-10} height={110} leafColor="#1A5A10" trunkColor="#4A2A10" />
      <PalmTree x={SW * 0.75} height={130} leafColor="#155010" trunkColor="#3A2008" />
      <PalmTree x={SW - 30} height={100} leafColor="#1A6010" trunkColor="#4A2A10" />
      {/* Bushes */}
      <Bush x={-8}         size={36} color="#0A3A08" />
      <Bush x={30}         size={28} color="#0E3A0A" />
      <Bush x={SW * 0.65}  size={32} color="#0A3A08" />
      <Bush x={SW * 0.8}   size={40} color="#0E4A0A" />
      <Bush x={SW - 20}    size={26} color="#0A3A08" />
      {/* Ground dirt texture */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, backgroundColor: '#1A1008' }}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', bottom: 4 + i * 6, left: SW * 0.1 * i, width: 30 + i * 10, height: 3, backgroundColor: '#0E0804', borderRadius: 2, opacity: 0.6 }} />
        ))}
      </View>
      {/* Grass patches */}
      {[20, 80, 140, 200, 260, 310].map((x, i) => (
        <View key={i} style={{ position: 'absolute', bottom: 48, left: x }}>
          {[0,1,2].map(j => <View key={j} style={{ position: 'absolute', left: j * 5, bottom: 0, width: 3, height: 8 + (j % 3) * 3, backgroundColor: '#2A5A18', borderRadius: 1 }} />)}
        </View>
      ))}
      {/* Dinosaurs */}
      <Pterodactyl />
      <Raptor />
      <TRex />
      {/* Ferns foreground */}
      {[SW * 0.25, SW * 0.55].map((x, i) => (
        <View key={i} style={{ position: 'absolute', bottom: 28, left: x }}>
          {[-25,-12,0,12,25].map((rot, j) => (
            <View key={j} style={{ position: 'absolute', left: 0, bottom: 0, width: 20, height: 6, backgroundColor: '#1A5A10', borderRadius: 3, transform: [{ rotate: `${rot}deg` }, { translateY: Math.abs(rot) * 0.2 }], opacity: 0.9 }} />
          ))}
        </View>
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 6 — UNDERWATER
// ════════════════════════════════════════════════════════════════
function BubbleStream({ x, delay }: { x: number; delay: number }) {
  const y = useRef(new Animated.Value(0)).current
  const op = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const run = () => {
      y.setValue(0); op.setValue(0)
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y,  { toValue: -200, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(op, { toValue: 0.7, duration: 500,  useNativeDriver: true }),
            Animated.timing(op, { toValue: 0,   duration: 2500, useNativeDriver: true }),
          ]),
        ]),
      ]).start(run)
    }
    run()
  }, [])
  return (
    <Animated.View style={{ position: 'absolute', bottom: 20, left: x, opacity: op, transform: [{ translateY: y }] }}>
      {[0,1,2].map(i => (
        <View key={i} style={{
          position: 'absolute', left: i * 6, bottom: i * 12,
          width: 4 + i * 2, height: 4 + i * 2, borderRadius: 4,
          backgroundColor: '#AADDFF', opacity: 0.6,
        }} />
      ))}
    </Animated.View>
  )
}

function CausticLight({ x, y }: { x: number; y: number }) {
  const op = useLoop(0, 0.15, 1500 + Math.random() * 800, Math.random() * 1000)
  return (
    <Animated.View style={{
      position: 'absolute', top: y, left: x,
      width: 40, height: 80, borderRadius: 20,
      backgroundColor: '#00AAFF', opacity: op,
      transform: [{ scaleX: 0.3 }],
    }} />
  )
}

function Fish({ startX, y, speed }: { startX: number; y: number; speed: number }) {
  const x = useRef(new Animated.Value(startX)).current
  useEffect(() => {
    const cycle = () => {
      x.setValue(SW + 30)
      Animated.sequence([
        Animated.delay(2000 + Math.random() * 8000),
        Animated.timing(x, { toValue: -30, duration: speed, useNativeDriver: true }),
      ]).start(cycle)
    }
    cycle()
  }, [])
  return (
    <Animated.View style={{ position: 'absolute', top: y, transform: [{ translateX: x }] }}>
      <View style={{ width: 24, height: 12, backgroundColor: '#FF6644', borderRadius: 6 }}>
        <View style={{ position: 'absolute', top: 3, left: 3, width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFF', opacity: 0.8 }} />
        <View style={{ position: 'absolute', top: 4, left: 4, width: 3, height: 3, borderRadius: 2, backgroundColor: '#000' }} />
      </View>
      <View style={{ position: 'absolute', left: -8, top: 2, width: 10, height: 8, backgroundColor: '#FF6644', borderRadius: 2, transform: [{ rotate: '30deg' }] }} />
    </Animated.View>
  )
}

export function OceanScene({ accent }: { accent: string }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Water tint overlay */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#001A2A', opacity: 0.4 }} />
      {/* Caustic light rays */}
      {[SW*0.1, SW*0.3, SW*0.5, SW*0.7, SW*0.9].map((x, i) => (
        <CausticLight key={i} x={x} y={0} />
      ))}
      {/* Coral on sides */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: 40 }}>
        {[[6,40,'#FF4488'],[14,55,'#FF8844'],[22,35,'#FFAA22'],[2,25,'#FF2266']].map(([x,h,c],i) => (
          <View key={i} style={{ position: 'absolute', bottom: 0, left: Number(x), width: 10, height: Number(h), backgroundColor: String(c), borderRadius: 5 }}>
            <View style={{ position: 'absolute', top: -4, left: 1, width: 8, height: 8, borderRadius: 4, backgroundColor: String(c) }} />
          </View>
        ))}
      </View>
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: 40 }}>
        {[[4,35,'#FF4488'],[12,50,'#FF8844'],[20,30,'#22AAFF']].map(([x,h,c],i) => (
          <View key={i} style={{ position: 'absolute', bottom: 0, left: Number(x), width: 10, height: Number(h), backgroundColor: String(c), borderRadius: 5 }}>
            <View style={{ position: 'absolute', top: -4, left: 1, width: 8, height: 8, borderRadius: 4, backgroundColor: String(c) }} />
          </View>
        ))}
      </View>
      {/* Bubble streams */}
      {[SW*0.1, SW*0.25, SW*0.45, SW*0.6, SW*0.8].map((x, i) => (
        <BubbleStream key={i} x={x} delay={i * 600} />
      ))}
      {/* Fish */}
      <Fish startX={SW+30} y={60}  speed={5000} />
      <Fish startX={SW+30} y={100} speed={7000} />
      <Fish startX={SW+30} y={150} speed={4000} />
      {/* Seaweed */}
      {[30, 80, SW-50, SW-100].map((x, i) => (
        <View key={i} style={{ position: 'absolute', bottom: 0, left: x }}>
          {[...Array(5)].map((_, j) => (
            <View key={j} style={{ position: 'absolute', bottom: j * 10, left: Math.sin(j) * 4, width: 6, height: 12, backgroundColor: '#0A5A1A', borderRadius: 3 }} />
          ))}
        </View>
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 7 — VOLCANO
// ════════════════════════════════════════════════════════════════
function LavaFlow({ side }: { side: 'left' | 'right' }) {
  const glow = useLoopNonNative(0.4, 0.9, 800, side === 'right' ? 400 : 0)
  const drip = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(drip, { toValue: 80, duration: 2000, useNativeDriver: false }),
      Animated.timing(drip, { toValue: 0,  duration: 0,    useNativeDriver: false }),
      Animated.delay(1500),
    ])).start()
  }, [])
  return (
    <Animated.View style={{
      position: 'absolute',
      top: 20,
      [side]: 0,
      width: 30, height: 200,
      opacity: glow,
    }}>
      <View style={{ flex: 1, backgroundColor: '#FF3300', borderRadius: 4, opacity: 0.6 }} />
      <Animated.View style={{
        position: 'absolute', top: drip,
        left: side === 'left' ? 10 : 8,
        width: 12, height: 30,
        backgroundColor: '#FF6600', borderRadius: 6,
      }} />
    </Animated.View>
  )
}

function Ember({ x, delay }: { x: number; delay: number }) {
  const y = useRef(new Animated.Value(0)).current
  const op = useRef(new Animated.Value(0)).current
  const driftX = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const run = () => {
      y.setValue(SH * 0.3); op.setValue(0); driftX.setValue(0)
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y,      { toValue: -40, duration: 3000, useNativeDriver: true }),
          Animated.timing(driftX, { toValue: (Math.random() - 0.5) * 60, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(op, { toValue: 1,   duration: 500,  useNativeDriver: true }),
            Animated.timing(op, { toValue: 0,   duration: 2500, useNativeDriver: true }),
          ]),
        ]),
      ]).start(run)
    }
    run()
  }, [])
  return (
    <Animated.View style={{
      position: 'absolute', left: x,
      width: 4, height: 4, borderRadius: 2,
      backgroundColor: '#FF6600',
      opacity: op,
      transform: [{ translateY: y }, { translateX: driftX }],
    }} />
  )
}

function LavaBubble({ x, delay }: { x: number; delay: number }) {
  const scale = useRef(new Animated.Value(0)).current
  const op    = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const run = () => {
      scale.setValue(0); op.setValue(0.9)
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.4, duration: 700, useNativeDriver: true }),
          Animated.timing(op,    { toValue: 0,   duration: 700, useNativeDriver: true }),
        ]),
        Animated.delay(800 + Math.random() * 1200),
      ]).start(run)
    }
    run()
  }, [])
  return (
    <Animated.View style={{
      position: 'absolute', bottom: 8, left: x,
      width: 12, height: 12, borderRadius: 6,
      backgroundColor: '#FF4400', opacity: op,
      transform: [{ scale }],
    }} />
  )
}

export function FireScene({ active }: { active: boolean }) {
  const ceilGlow = useLoop(0.25, 0.55, 900)

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* ── Magma dome ceiling ── */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 55, backgroundColor: '#FF2200', opacity: ceilGlow }} />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 55, backgroundColor: '#1A0800', opacity: 0.55 }} />
      {/* Stalactites hanging from ceiling */}
      {[SW*0.06, SW*0.18, SW*0.31, SW*0.44, SW*0.57, SW*0.69, SW*0.80, SW*0.92].map((x, i) => (
        <View key={i} style={{
          position: 'absolute', top: 0, left: x,
          width: 10 + (i % 3) * 5, height: 20 + (i % 4) * 12,
          backgroundColor: '#2A0800', borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
        }}>
          <View style={{ position: 'absolute', bottom: -4, left: '30%', width: '40%', height: 8, backgroundColor: '#FF3300', opacity: 0.3, borderRadius: 2 }} />
        </View>
      ))}

      {/* ── Cave rock walls ── */}
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 28, backgroundColor: '#1A0800', borderRightWidth: 3, borderRightColor: '#330800' }}>
        {[25, 60, 100, 145, 185].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 0, width: 28, height: 14 + (i%3)*4, backgroundColor: '#220A00', borderRadius: 2 }} />
        ))}
        <View style={{ position: 'absolute', top: 60, left: 4, width: 6, height: 80, backgroundColor: '#FF3300', opacity: 0.15, borderRadius: 3 }} />
      </View>
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 28, backgroundColor: '#1A0800', borderLeftWidth: 3, borderLeftColor: '#330800' }}>
        {[35, 75, 115, 160].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, right: 0, width: 28, height: 16 + (i%3)*4, backgroundColor: '#220A00', borderRadius: 2 }} />
        ))}
        <View style={{ position: 'absolute', top: 80, right: 4, width: 6, height: 70, backgroundColor: '#FF3300', opacity: 0.15, borderRadius: 3 }} />
      </View>

      {/* ── Lava flows on walls ── */}
      <LavaFlow side="left" />
      <LavaFlow side="right" />

      {/* ── Lava lake at floor ── */}
      <View style={{ position: 'absolute', bottom: 0, left: 28, right: 28, height: 28, backgroundColor: '#CC2200', borderRadius: 6, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: '#FF4400', opacity: 0.7 }} />
        <View style={{ position: 'absolute', top: 4, left: '15%', width: '25%', height: 6, backgroundColor: '#FF6600', opacity: 0.5, borderRadius: 3 }} />
        <View style={{ position: 'absolute', top: 6, left: '55%', width: '20%', height: 5, backgroundColor: '#FF6600', opacity: 0.4, borderRadius: 3 }} />
        {/* Bubbles */}
        {[SW*0.15, SW*0.35, SW*0.55, SW*0.75].map((x, i) => (
          <LavaBubble key={i} x={x - 28} delay={i * 500} />
        ))}
      </View>

      {/* ── Embers ── */}
      {active && [SW*0.15, SW*0.3, SW*0.5, SW*0.65, SW*0.8].map((x, i) => (
        <Ember key={i} x={x} delay={i * 600} />
      ))}

      {/* ── Floor lava cracks ── */}
      {[SW*0.2, SW*0.42, SW*0.65].map((x, i) => (
        <View key={i} style={{ position: 'absolute', bottom: 28, left: x, width: 22, height: 3, backgroundColor: '#FF3300', opacity: 0.45, borderRadius: 1 }} />
      ))}
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 8 — JUNGLE TEMPLE
// ════════════════════════════════════════════════════════════════
function TorchFlame({ x, y, active }: { x: number; y: number; active: boolean }) {
  const f1 = useLoop(0.5, 1, 110, 0)
  const f2 = useLoop(0.7, 1, 90, 50)
  return (
    <View style={{ position: 'absolute', top: y, left: x, alignItems: 'center' }}>
      <View style={{ width: 8, height: 24, backgroundColor: '#3A2010', borderRadius: 2 }}>
        {active && (
          <>
            <Animated.View style={{ position: 'absolute', top: -16, left: -5, width: 18, height: 22, borderRadius: 9, backgroundColor: '#FF6600', opacity: f1 }} />
            <Animated.View style={{ position: 'absolute', top: -12, left: -2, width: 12, height: 16, borderRadius: 6, backgroundColor: '#FFB800', opacity: f2 }} />
            <View style={{ position: 'absolute', top: -6, left: 1, width: 6, height: 8, borderRadius: 3, backgroundColor: '#FFEE88' }} />
          </>
        )}
      </View>
    </View>
  )
}

function StoneBlock({ x, y, w = 40, h = 20 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <View style={{ position: 'absolute', top: y, left: x, width: w, height: h, backgroundColor: '#3A3A28', borderWidth: 1, borderColor: '#2A2A18' }}>
      <View style={{ position: 'absolute', top: 2, left: 2, right: 2, height: 2, backgroundColor: 'rgba(255,255,255,0.05)' }} />
    </View>
  )
}

export function JungleTempleScene({ active }: { active: boolean }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Stone ceiling */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 35, backgroundColor: '#2A2A18' }}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', top: 0, left: i * (SW / 8), width: SW / 8 - 1, height: 35, backgroundColor: i % 2 === 0 ? '#2A2A18' : '#252518' }} />
        ))}
      </View>
      {/* Stone walls */}
      <View style={{ position: 'absolute', top: 35, left: 0, bottom: 0, width: 26 }}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ height: 28, backgroundColor: i % 2 === 0 ? '#353525' : '#2E2E1E', borderBottomWidth: 1, borderBottomColor: '#1A1A0E' }} />
        ))}
        {/* Glowing rune carvings */}
        {[40, 90, 140].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 4, width: 18, height: 16, borderWidth: 1, borderColor: '#00CC55', opacity: 0.3 }}>
            <View style={{ position: 'absolute', top: 4, left: 3, width: 10, height: 2, backgroundColor: '#00CC55' }} />
            <View style={{ position: 'absolute', top: 8, left: 3, width: 6,  height: 2, backgroundColor: '#00CC55' }} />
          </View>
        ))}
      </View>
      <View style={{ position: 'absolute', top: 35, right: 0, bottom: 0, width: 26 }}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ height: 28, backgroundColor: i % 2 === 0 ? '#353525' : '#2E2E1E', borderBottomWidth: 1, borderBottomColor: '#1A1A0E' }} />
        ))}
      </View>
      {/* Stone block decorations */}
      <StoneBlock x={30} y={50} w={50} h={24} />
      <StoneBlock x={SW-80} y={60} w={50} h={24} />
      {/* Hanging vines */}
      {[SW*0.15, SW*0.35, SW*0.55, SW*0.75].map((x, i) => (
        <View key={i} style={{ position: 'absolute', top: 0, left: x }}>
          {[...Array(6 + i % 3)].map((_, j) => (
            <View key={j} style={{ width: 4, height: 14, backgroundColor: '#1A5A10', borderRadius: 2, marginTop: 2, marginLeft: (j % 2) * 2 }} />
          ))}
        </View>
      ))}
      {/* Torches */}
      <TorchFlame x={22}     y={60} active={active} />
      <TorchFlame x={SW-38}  y={60} active={active} />
      <TorchFlame x={SW*0.45} y={45} active={active} />
      {/* Stone floor tiles */}
      <View style={{ position: 'absolute', bottom: 0, left: 26, right: 26, height: 16 }}>
        {[...Array(7)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', bottom: 0, left: i * (SW / 7), width: SW / 7 - 2, height: 16, backgroundColor: '#2E2E1E', borderWidth: 0.5, borderColor: '#1A1A0E' }} />
        ))}
      </View>
      {/* Ancient idol */}
      <View style={{ position: 'absolute', top: 55, left: SW*0.44, alignItems: 'center' }}>
        <View style={{ width: 14, height: 20, backgroundColor: '#3A3A28', borderRadius: 2 }}>
          <View style={{ position: 'absolute', top: 3, left: 2, width: 10, height: 7, backgroundColor: '#2A2A18', borderRadius: 1 }}>
            <View style={{ position: 'absolute', top: 1, left: 1, width: 3, height: 3, borderRadius: 2, backgroundColor: '#00CC55', opacity: 0.8 }} />
            <View style={{ position: 'absolute', top: 1, right: 1, width: 3, height: 3, borderRadius: 2, backgroundColor: '#00CC55', opacity: 0.8 }} />
          </View>
        </View>
        <View style={{ width: 20, height: 4, backgroundColor: '#2A2A18' }} />
      </View>
    </View>
  )
}

// ════════════════════════════════════════════════════════════════
// WORLD 9 — CYBERPUNK
// ════════════════════════════════════════════════════════════════
function RainDrop({ x, delay }: { x: number; delay: number }) {
  const y = useRef(new Animated.Value(-10)).current
  useEffect(() => {
    const run = () => {
      y.setValue(-10)
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(y, { toValue: SH * 0.5, duration: 800 + Math.random() * 400, useNativeDriver: true }),
      ]).start(run)
    }
    run()
  }, [])
  return (
    <Animated.View style={{ position: 'absolute', left: x, width: 1, height: 12, backgroundColor: '#88AACC', opacity: 0.3, transform: [{ translateY: y }] }} />
  )
}

function NeonSign({ x, y, color, width = 50 }: { x: number; y: number; color: string; width?: number }) {
  const flicker = useLoop(0.3, 1, 200 + Math.random() * 300, Math.random() * 500)
  return (
    <Animated.View style={{ position: 'absolute', top: y, left: x, opacity: flicker }}>
      <View style={{ width, height: 16, borderWidth: 2, borderColor: color, borderRadius: 3, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', shadowColor: color, shadowOpacity: 0.8, shadowRadius: 6 }}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={{ width: width - 10 - i * 8, height: 2, backgroundColor: color, marginVertical: 1, opacity: 0.6 }} />
        ))}
      </View>
    </Animated.View>
  )
}

function DataStream({ x }: { x: number }) {
  const y = useRef(new Animated.Value(-20)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(y, { toValue: SH * 0.7, duration: 2000 + Math.random() * 1000, useNativeDriver: true })
    ).start()
  }, [])
  return (
    <Animated.View style={{ position: 'absolute', left: x, transform: [{ translateY: y }] }}>
      {[0,1,2,3,4].map(i => (
        <View key={i} style={{ width: 8, height: 8, backgroundColor: i % 2 === 0 ? '#FF00CC' : '#00FFFF', opacity: 0.4 - i * 0.07, marginVertical: 2, borderRadius: 1 }} />
      ))}
    </Animated.View>
  )
}

export function CyberpunkScene({ accent }: { accent: string }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Glass walls showing city */}
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 28, backgroundColor: 'rgba(20,0,40,0.8)', borderRightWidth: 2, borderRightColor: accent }}>
        {/* City windows */}
        {[20,40,70,100,130,160].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, left: 4, width: i%2===0?16:10, height: 6, backgroundColor: i%3===0?'#00FFFF':'#FF00CC', opacity: 0.3 }} />
        ))}
      </View>
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 28, backgroundColor: 'rgba(20,0,40,0.8)', borderLeftWidth: 2, borderLeftColor: accent }}>
        {[30,55,85,115,145].map((y, i) => (
          <View key={i} style={{ position: 'absolute', top: y, right: 4, width: i%2===0?14:8, height: 6, backgroundColor: i%3===0?'#FFFF00':accent, opacity: 0.3 }} />
        ))}
      </View>
      {/* Neon ceiling strip */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: accent, opacity: 0.3 }} />
      {/* Neon floor strip */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: accent, opacity: 0.5 }} />
      {/* Neon grid floor */}
      <View style={{ position: 'absolute', bottom: 0, left: 28, right: 28, height: 30 }}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', bottom: i * 6, left: 0, right: 0, height: 1, backgroundColor: accent, opacity: 0.2 }} />
        ))}
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ position: 'absolute', bottom: 0, left: i * (SW / 8), width: 1, height: 30, backgroundColor: accent, opacity: 0.15 }} />
        ))}
      </View>
      {/* Neon signs */}
      <NeonSign x={35}     y={50} color="#FF00CC" width={55} />
      <NeonSign x={SW-95}  y={65} color="#00FFFF" width={55} />
      <NeonSign x={SW*0.35} y={30} color={accent}   width={40} />
      {/* Rain on glass */}
      {[...Array(12)].map((_, i) => (
        <RainDrop key={i} x={4 + i * 2} delay={i * 70} />
      ))}
      {/* Data streams */}
      {[SW*0.15, SW*0.3, SW*0.55, SW*0.72].map((x, i) => (
        <DataStream key={i} x={x} />
      ))}
      {/* Holographic display */}
      <View style={{ position: 'absolute', top: 75, left: SW*0.42, width: 50, height: 35, borderWidth: 1, borderColor: '#00FFFF', borderRadius: 3, backgroundColor: 'rgba(0,255,255,0.05)' }}>
        {[0,1,2].map(i => (
          <View key={i} style={{ position: 'absolute', top: 6 + i * 8, left: 4, width: 30 - i * 6, height: 2, backgroundColor: '#00FFFF', opacity: 0.5 }} />
        ))}
      </View>
    </View>
  )
}
