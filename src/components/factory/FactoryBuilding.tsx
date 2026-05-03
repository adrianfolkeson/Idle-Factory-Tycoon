import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import { WorldTheme } from '../../types'
import ConveyorBelt from './ConveyorBelt'
import ChimneySmoke from './ChimneySmoke'
import GearSpinner from './GearSpinner'
import BusseRobot from '../characters/BusseRobot'
import BosseCharacter from '../characters/BosseCharacter'
import SkuggaGhost from '../characters/SkuggaGhost'
import {
  EnergyScene, LabScene, SpaceEscapePodScene, SpaceRocketScene, VikingScene,
  DinoScene, OceanScene, FireScene, JungleTempleScene, CyberpunkScene,
} from './WorldScenes'

// ─── Tier 1: Electric arc ──────────────────────────────────────────────────────
function ElectricArc({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const op   = useRef(new Animated.Value(0)).current
  const offY = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const flash = () => {
      op.setValue(0); offY.setValue(0)
      Animated.sequence([
        Animated.delay(1500 + Math.random() * 2000),
        Animated.parallel([
          Animated.timing(op,   { toValue: 1,  duration: 60,  useNativeDriver: false }),
          Animated.timing(offY, { toValue: -4, duration: 60,  useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(op,   { toValue: 0.4, duration: 50, useNativeDriver: false }),
          Animated.timing(offY, { toValue: 3,   duration: 50, useNativeDriver: false }),
        ]),
        Animated.timing(op, { toValue: 1, duration: 40, useNativeDriver: false }),
        Animated.timing(op, { toValue: 0, duration: 80, useNativeDriver: false }),
      ]).start(flash)
    }
    flash()
  }, [])
  const mid = (x1 + x2) / 2
  return (
    <Animated.View pointerEvents="none"
      style={{ position: 'absolute', top: y, left: x1, width: x2 - x1, height: 6, opacity: op }}>
      <View style={{ position: 'absolute', top: 2, left: 0, right: 0, height: 2, backgroundColor: color, borderRadius: 1, opacity: 0.9 }} />
      <Animated.View style={{ position: 'absolute', top: offY, left: mid - x1 - 8, width: 16, height: 3, backgroundColor: '#FFFFFF', borderRadius: 1 }} />
    </Animated.View>
  )
}

// ─── Tier 2: Floating nano-particle ────────────────────────────────────────────
function NanoParticle({ x, delay, color }: { x: number; delay: number; color: string }) {
  const y  = useRef(new Animated.Value(0)).current
  const op = useRef(new Animated.Value(0)).current
  const sx = useRef(new Animated.Value(1)).current
  useEffect(() => {
    const run = () => {
      y.setValue(0); op.setValue(0); sx.setValue(1)
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y,  { toValue: -70, duration: 3000, useNativeDriver: false }),
          Animated.timing(sx, { toValue: 1.8, duration: 3000, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(op, { toValue: 0.8, duration: 600,  useNativeDriver: false }),
            Animated.timing(op, { toValue: 0,   duration: 2400, useNativeDriver: false }),
          ]),
        ]),
      ]).start(run)
    }
    run()
  }, [])
  return (
    <Animated.View pointerEvents="none"
      style={{
        position: 'absolute', bottom: 20, left: x,
        width: 5, height: 5, borderRadius: 3,
        backgroundColor: color,
        opacity: op,
        transform: [{ scaleX: sx }],
      }}
    />
  )
}

// ─── Tier 3: Space background — scrolling parallax ────────────────────────────

// Seeded pseudo-random so layout is stable across renders
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// Single scrolling layer (stars, planet, asteroid)
function SpaceLayer({ speed, children, height }: { speed: number; children: React.ReactNode; height: number }) {
  const x = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: -SW, duration: speed, useNativeDriver: true })
    ).start()
  }, [])
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, width: SW * 2, height, transform: [{ translateX: x }] }}
    >
      {children}
    </Animated.View>
  )
}

function TwinkleStar({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const op = useRef(new Animated.Value(seededRand(x + y))).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(op, { toValue: 0.15, duration: 700 + seededRand(x) * 800, useNativeDriver: false }),
      Animated.timing(op, { toValue: 1,    duration: 700 + seededRand(y) * 800, useNativeDriver: false }),
    ])).start()
  }, [])
  return (
    <Animated.View style={{
      position: 'absolute', top: y, left: x,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#FFFFFF', opacity: op,
    }} />
  )
}

function Planet({ x, y, radius, color, ringColor }: { x: number; y: number; radius: number; color: string; ringColor?: string }) {
  return (
    <View style={{ position: 'absolute', top: y - radius, left: x - radius }}>
      <View style={{
        width: radius * 2, height: radius * 2, borderRadius: radius,
        backgroundColor: color,
        shadowColor: color, shadowOpacity: 0.8, shadowRadius: radius * 0.4,
        elevation: 4,
      }}>
        {/* Atmospheric stripe */}
        <View style={{ position: 'absolute', top: radius * 0.3, left: 0, right: 0, height: radius * 0.25, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
      </View>
      {ringColor && (
        <View style={{
          position: 'absolute',
          top: radius * 0.7, left: -radius * 0.5,
          width: radius * 3, height: radius * 0.4,
          borderRadius: radius,
          borderWidth: radius * 0.15, borderColor: ringColor,
          backgroundColor: 'transparent',
          transform: [{ scaleY: 0.35 }],
        }} />
      )}
    </View>
  )
}

function Asteroid({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <View style={{
      position: 'absolute', top: y, left: x,
      width: size, height: size * 0.7,
      backgroundColor: '#5A4A3A', borderRadius: size * 0.3,
      transform: [{ rotate: '25deg' }],
    }}>
      <View style={{ position: 'absolute', top: 2, left: 3, width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1, backgroundColor: '#3A2A1A' }} />
      <View style={{ position: 'absolute', top: size * 0.3, left: size * 0.5, width: size * 0.15, height: size * 0.15, borderRadius: size * 0.08, backgroundColor: '#3A2A1A' }} />
    </View>
  )
}

function SpaceBackground() {
  // Far layer: dense small stars (slow)
  const farStars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: seededRand(i * 7.3) * SW * 2,
    y: seededRand(i * 3.7) * 220,
    size: seededRand(i * 11.1) > 0.7 ? 2 : 1,
    delay: seededRand(i * 5.2) * 2000,
  }))
  // Mid layer: medium stars + planet (medium speed)
  const midStars = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: seededRand(i * 13.1) * SW * 2,
    y: seededRand(i * 6.4) * 200,
    size: 2,
    delay: seededRand(i * 9.1) * 1500,
  }))
  // Near layer: asteroids (fast)
  const asteroids = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: seededRand(i * 17.3) * SW * 2,
    y: 20 + seededRand(i * 8.7) * 180,
    size: 10 + seededRand(i * 4.4) * 16,
  }))

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Far parallax — slowest */}
      <SpaceLayer speed={22000} height={240}>
        {farStars.map(s => <TwinkleStar key={s.id} x={s.x} y={s.y} size={s.size} delay={s.delay} />)}
        <Planet x={SW * 0.3}  y={60}  radius={28} color="#8B4E9C" ringColor="rgba(200,150,255,0.5)" />
        <Planet x={SW * 1.1} y={90}  radius={18} color="#4E6E9C" />
      </SpaceLayer>
      {/* Mid parallax */}
      <SpaceLayer speed={14000} height={240}>
        {midStars.map(s => <TwinkleStar key={s.id} x={s.x} y={s.y} size={s.size} delay={s.delay} />)}
        <Planet x={SW * 0.75} y={45}  radius={14} color="#9C7A4E" />
        <Planet x={SW * 1.5}  y={110} radius={22} color="#4E9C6A" ringColor="rgba(150,255,200,0.4)" />
      </SpaceLayer>
      {/* Near parallax — asteroids, fastest */}
      <SpaceLayer speed={8000} height={240}>
        {asteroids.map(a => <Asteroid key={a.id} x={a.x} y={a.y} size={a.size} />)}
      </SpaceLayer>
    </View>
  )
}

// ─── Tier 3: Rocket exhaust ────────────────────────────────────────────────────
function RocketExhaust({ x, active }: { x: number; active: boolean }) {
  const p0y = useRef(new Animated.Value(0)).current; const p0op = useRef(new Animated.Value(0)).current; const p0sc = useRef(new Animated.Value(0.5)).current
  const p1y = useRef(new Animated.Value(0)).current; const p1op = useRef(new Animated.Value(0)).current; const p1sc = useRef(new Animated.Value(0.5)).current
  const p2y = useRef(new Animated.Value(0)).current; const p2op = useRef(new Animated.Value(0)).current; const p2sc = useRef(new Animated.Value(0.5)).current
  const puffs = [{ y:p0y, op:p0op, sc:p0sc }, { y:p1y, op:p1op, sc:p1sc }, { y:p2y, op:p2op, sc:p2sc }]
  useEffect(() => {
    if (!active) return
    puffs.forEach((p, i) => {
      const run = () => {
        p.y.setValue(0); p.op.setValue(0); p.sc.setValue(0.4)
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.parallel([
            Animated.timing(p.y,  { toValue: 24,  duration: 600, useNativeDriver: false }),
            Animated.timing(p.sc, { toValue: 1.6, duration: 600, useNativeDriver: false }),
            Animated.sequence([
              Animated.timing(p.op, { toValue: 0.9, duration: 200, useNativeDriver: false }),
              Animated.timing(p.op, { toValue: 0,   duration: 400, useNativeDriver: false }),
            ]),
          ]),
        ]).start(run)
      }
      run()
    })
  }, [active])
  return (
    <View style={{ position: 'absolute', bottom: 0, left: x - 10, width: 20 }} pointerEvents="none">
      {puffs.map((p, i) => (
        <Animated.View key={i}
          style={{
            position: 'absolute', bottom: 0, left: 4,
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: i === 0 ? '#FF6600' : i === 1 ? '#FFAA00' : '#FF2200',
            opacity: p.op,
            transform: [{ translateY: p.y }, { scale: p.sc }],
          }}
        />
      ))}
      <View style={{ width: 10, height: 18, backgroundColor: '#888', borderRadius: 3, alignSelf: 'center', marginBottom: 0 }} />
    </View>
  )
}

const { width: SW, height: SH } = Dimensions.get('window')

// ─── Small helpers ─────────────────────────────────────────────────────────────
function lighten(hex: string, amt = 35): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16)
    return `rgb(${Math.min(255,((n>>16)&0xff)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`
  } catch { return hex }
}
function darken(hex: string, amt = 28): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16)
    return `rgb(${Math.max(0,((n>>16)&0xff)-amt)},${Math.max(0,((n>>8)&0xff)-amt)},${Math.max(0,(n&0xff)-amt)})`
  } catch { return hex }
}

// ─── Blinking light ────────────────────────────────────────────────────────────
function Blink({ color, size = 7, delay = 0 }: { color: string; size?: number; delay?: number }) {
  const op = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(op, { toValue: 0.15, duration: 350, useNativeDriver: true }),
      Animated.timing(op, { toValue: 1,    duration: 350, useNativeDriver: true }),
      Animated.delay(1800),
    ])).start()
  }, [])
  return <Animated.View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: op }} />
}

// ─── Pendant hanging light ──────────────────────────────────────────────────────
function PendantLight({ active, x }: { active: boolean; x: number }) {
  const glow = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    if (!active) return
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 0.9, duration: 1100, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0.5, duration: 1100, useNativeDriver: false }),
    ])).start()
  }, [active])
  return (
    <View style={[styles.pendant, { left: x }]}>
      <View style={styles.pendantCord} />
      <View style={[styles.pendantCone, { backgroundColor: '#3A3A3A' }]} />
      {active && (
        <Animated.View style={[styles.pendantGlow, { opacity: glow }]} />
      )}
    </View>
  )
}

// ─── Window with cross-bars, glow, optional gear ───────────────────────────────
function FactWindow({ glowing, showGear, color, size = 54 }: { glowing: boolean; showGear?: boolean; color: string; size?: number }) {
  const glow = useRef(new Animated.Value(0.2)).current
  useEffect(() => {
    if (!glowing) return
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 0.9, duration: 900, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0.55, duration: 1300, useNativeDriver: false }),
    ])).start()
  }, [glowing])
  return (
    <View style={[styles.win, { width: size, height: size + 6 }]}>
      <View style={styles.winShadow} />
      <View style={styles.winFrame}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: glowing ? color : '#111', opacity: glow }]} />
        <View style={styles.winBarH} /><View style={styles.winBarV} />
        {showGear && glowing && (
          <View style={styles.winGear}><GearSpinner size={18} color="rgba(0,0,0,0.55)" speed={1400} /></View>
        )}
        <View style={styles.winLedge} />
      </View>
    </View>
  )
}

// ─── Stacked product boxes ──────────────────────────────────────────────────────
function BoxStack() {
  return (
    <View>
      <View style={styles.boxRow2}>
        {[['#7B4A08','#9B6010'],['#5A3208','#7B4808']].map(([c,t],i) => (
          <View key={i} style={[styles.b3d]}>
            <View style={[styles.b3dFront,{backgroundColor:c}]} />
            <View style={[styles.b3dTop,{backgroundColor:t}]} />
            <View style={[styles.b3dSide,{backgroundColor:darken(c,35)}]} />
          </View>
        ))}
      </View>
      <View style={styles.boxRow3}>
        {[['#8B5E0A','#A07015'],['#6A4808','#8A6010'],['#7B4A08','#9B6010']].map(([c,t],i) => (
          <View key={i} style={[styles.b3d]}>
            <View style={[styles.b3dFront,{backgroundColor:c}]} />
            <View style={[styles.b3dTop,{backgroundColor:t}]} />
            <View style={[styles.b3dSide,{backgroundColor:darken(c,35)}]} />
          </View>
        ))}
      </View>
    </View>
  )
}

// ─── Industrial tank (big cylinder) ────────────────────────────────────────────
function Tank({ color }: { color: string }) {
  const b0y = useRef(new Animated.Value(0)).current
  const b0op = useRef(new Animated.Value(0)).current
  const b1y = useRef(new Animated.Value(0)).current
  const b1op = useRef(new Animated.Value(0)).current
  const b2y = useRef(new Animated.Value(0)).current
  const b2op = useRef(new Animated.Value(0)).current
  const bubbles = [{ y: b0y, op: b0op }, { y: b1y, op: b1op }, { y: b2y, op: b2op }]
  useEffect(() => {
    bubbles.forEach((b,i) => {
      const run = () => {
        b.y.setValue(0); b.op.setValue(0)
        Animated.sequence([
          Animated.delay(i * 800),
          Animated.parallel([
            Animated.timing(b.y,  { toValue: -30, duration: 1200, useNativeDriver: false }),
            Animated.sequence([
              Animated.timing(b.op, { toValue: 0.6, duration: 300, useNativeDriver: false }),
              Animated.timing(b.op, { toValue: 0,   duration: 900, useNativeDriver: false }),
            ]),
          ]),
        ]).start(run)
      }
      run()
    })
  }, [])
  return (
    <View style={styles.tank}>
      {/* Cylinder body */}
      <View style={[styles.tankBody, { backgroundColor: darken(color, 40) }]}>
        {/* Rivets */}
        {[10, 30, 50, 70].map(y => (
          <View key={y} style={[styles.tankRivetRow]}>
            {[0,1,2].map(x => <View key={x} style={styles.tankRivet} />)}
          </View>
        ))}
        {/* Liquid level window */}
        <View style={styles.tankWindow}>
          <Animated.View style={[styles.tankLiquid, { backgroundColor: color, opacity: 0.6 }]} />
          {bubbles.map((b,i) => (
            <Animated.View key={i} style={[styles.tankBubble,{opacity:b.op,transform:[{translateY:b.y},{translateX:(i-1)*6}]}]} />
          ))}
        </View>
        {/* Pressure gauge */}
        <View style={styles.gauge}>
          <View style={styles.gaugeFace} />
          <View style={[styles.gaugeNeedle, { transform: [{ rotate: '30deg' }] }]} />
        </View>
      </View>
      {/* Cap top */}
      <View style={[styles.tankCap, { backgroundColor: lighten(darken(color, 40), 20) }]} />
      {/* Pipe coming out */}
      <View style={[styles.tankPipeH, { backgroundColor: '#444' }]} />
    </View>
  )
}

// ─── Wall-mounted control panel ────────────────────────────────────────────────
function ControlPanel({ accent, active }: { accent: string; active: boolean }) {
  return (
    <View style={styles.cpOuter}>
      <Text style={[styles.cpLabel, { color: accent }]}>KONTROLLPANEL</Text>
      <View style={styles.cpBody}>
        {/* Gauge row */}
        <View style={styles.cpGauges}>
          {['TRYCK','TEMP','PROD'].map((lbl,i)=>(
            <View key={i} style={styles.cpGauge}>
              <View style={styles.cpGaugeFace}>
                <View style={[styles.cpGaugeNeedle,{transform:[{rotate:active?['45deg','20deg','-10deg'][i]:'−40deg'}]}]} />
              </View>
              <Text style={styles.cpGaugeLbl}>{lbl}</Text>
            </View>
          ))}
        </View>
        {/* Light row */}
        <View style={styles.cpLights}>
          <Blink color={active ? '#00FF88' : '#333'} delay={0} />
          <Blink color={active ? '#FFB800' : '#333'} delay={500} />
          <Blink color={active ? '#FF4444' : '#333'} delay={1100} />
          <Blink color={active ? '#00AAFF' : '#333'} delay={700} />
        </View>
        {/* Button row */}
        <View style={styles.cpBtns}>
          {['#CC3333','#33AA33','#3366CC'].map((c,i)=>(
            <View key={i} style={[styles.cpBtn, { backgroundColor: active ? c : '#2A2A2A', borderColor: active ? lighten(c) : '#333' }]} />
          ))}
        </View>
        <GearSpinner size={22} color={accent} speed={active ? 1400 : 6000} counterClockwise />
      </View>
    </View>
  )
}

// ─── Steam vent ─────────────────────────────────────────────────────────────────
function SteamPuff({ x, active }: { x: number; active: boolean }) {
  const p0y = useRef(new Animated.Value(0)).current; const p0op = useRef(new Animated.Value(0)).current
  const p1y = useRef(new Animated.Value(0)).current; const p1op = useRef(new Animated.Value(0)).current
  const puffs = [{ y: p0y, op: p0op }, { y: p1y, op: p1op }]
  useEffect(() => {
    if (!active) return
    puffs.forEach((p,i)=>{
      const run = ()=>{
        p.y.setValue(0); p.op.setValue(0)
        Animated.sequence([
          Animated.delay(i*700),
          Animated.parallel([
            Animated.timing(p.y,  { toValue:-28, duration:1000, useNativeDriver:false }),
            Animated.sequence([
              Animated.timing(p.op, { toValue:0.6, duration:300, useNativeDriver:false }),
              Animated.timing(p.op, { toValue:0,   duration:700, useNativeDriver:false }),
            ]),
          ]),
        ]).start(run)
      }
      run()
    })
  }, [active])
  return (
    <View style={[styles.ventWrap, { left: x }]} pointerEvents="none">
      {puffs.map((p,i)=>(
        <Animated.View key={i} style={[styles.ventPuff, { opacity: p.op, transform:[{translateY: p.y}] }]} />
      ))}
      <View style={styles.ventHole} />
    </View>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
interface Props {
  theme: WorldTheme
  skuggaVisible: boolean
  tapping: boolean
  productionRate: number
  worldName?: string
  autoUpgradeCount?: number
  tier?: number
  worldId?: number
}

export default function FactoryBuilding({ theme, skuggaVisible, tapping, productionRate, worldName = 'BOSSENS FABRIK', autoUpgradeCount = 0, tier = 0, worldId = 0 }: Props) {
  const active = productionRate > 0
  const hasHardHat = autoUpgradeCount > 0
  const bossRelaxing = autoUpgradeCount > 0
  const isOutdoor = worldId >= 3  // Space pod + all outdoor worlds — no factory chrome

  // ── OUTDOOR worlds: world scene IS the full background, no factory chrome ──
  if (isOutdoor) {
    return (
      <View style={[styles.scene, { backgroundColor: theme.sky }]}>
        <SkuggaGhost visible={skuggaVisible} />

        {/* Full-bleed world environment */}
        {worldId === 3 && <SpaceEscapePodScene accent={theme.accent} active={active} />}
        {worldId === 4 && <VikingScene active={active} />}
        {worldId === 5 && <DinoScene active={active} />}
        {worldId === 6 && <OceanScene accent={theme.accent} />}
        {worldId === 7 && <FireScene active={active} />}
        {worldId === 8 && <JungleTempleScene active={active} />}
        {worldId === 9 && <CyberpunkScene accent={theme.accent} />}

        {/* BUSSE working area — floats in world */}
        <View style={styles.outdoorWorkZone}>
          <View style={styles.outdoorBusseWrap}>
            <View style={styles.boxPileWrap}><BoxStack /></View>
            <BusseRobot color={theme.accent} hardHat={hasHardHat} worldId={worldId} />
          </View>
        </View>

        {/* Nano-particles for high tiers */}
        {tier >= 2 && active && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {[0,1,2,3,4].map(i => (
              <NanoParticle key={i} x={SW*(0.1+i*0.18)} delay={i*600} color={theme.accent} />
            ))}
          </View>
        )}

        {/* Conveyor belt */}
        <View style={styles.beltWrap}>
          <View style={[styles.beltFrame, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
          <ConveyorBelt
            width={SW}
            color={active ? '#555' : '#333'}
            stripeColor={active ? theme.accent : '#444'}
            active={active}
          />
          {[SW*0.1, SW*0.35, SW*0.6, SW*0.85].map((x,i) => (
            <View key={i} style={[styles.beltLeg, { left: x }]} />
          ))}
        </View>

        {/* Floor — transparent so world shows through */}
        <View style={[styles.floor, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
          <View style={styles.safetyStripe}>
            {[...Array(16)].map((_,i) => (
              <View key={i} style={[styles.safetyCell, { backgroundColor: i%2===0 ? theme.accent : 'transparent' }]} />
            ))}
          </View>
          <View style={styles.floorPropsWrap}>
            <WorldFloorProps worldId={worldId} accent={theme.accent} active={active} />
          </View>
          <View style={styles.bosseWrap}>
            <BosseCharacter tapping={tapping} size={52} relaxing={bossRelaxing} worldId={worldId} />
          </View>
        </View>
      </View>
    )
  }

  // ── FACTORY worlds (0-3): full factory chrome ──
  return (
    <View style={[styles.scene, { backgroundColor: theme.sky }]}>
      {tier >= 3 && <SpaceBackground />}
      <SkuggaGhost visible={skuggaVisible} />

      {worldId === 1 && <EnergyScene accent={theme.accent} />}
      {worldId === 2 && <LabScene accent={theme.accent} />}

      {/* ══════════ CEILING ══════════ */}
      <View style={[styles.ceiling, { backgroundColor: darken(theme.buildingTop, 40) }]}>
        {/* Structural beams */}
        {[SW*0.18, SW*0.44, SW*0.70].map((x,i) => (
          <View key={i} style={[styles.beam, { left: x }]} />
        ))}
        {/* Air duct running across */}
        <View style={[styles.duct, { backgroundColor: '#3A3A3A' }]}>
          {[0,1,2,3,4,5].map(i => <View key={i} style={styles.ductBand} />)}
          <View style={styles.ductGrill} />
        </View>
        {/* Hanging pendant lights */}
        {[SW*0.1, SW*0.3, SW*0.55, SW*0.75, SW*0.92].map((x,i) => (
          <PendantLight key={i} active={active} x={x} />
        ))}
        {/* Emergency light */}
        <View style={styles.emergencyLight}>
          <Blink color="#FF2200" size={10} delay={0} />
        </View>
      </View>

      {/* Smoke from vents */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <ChimneySmoke chimney1X={SW * 0.28} chimney2X={SW * 0.68} active={active} />
        <SteamPuff x={SW * 0.42} active={active} />
      </View>

      {/* ══════════ UPPER WALL ══════════ */}
      <View style={[styles.upperWall, { backgroundColor: theme.buildingBody }]}>
        {/* Wall panel texture — horizontal bands */}
        {[0,1,2].map(i => <View key={i} style={[styles.wallBand, { borderColor: darken(theme.buildingBody, 15) }]} />)}
        {/* Windows */}
        <View style={styles.winRow}>
          <FactWindow glowing={active} color={theme.windowColor} size={56} />
          <FactWindow glowing={active} showGear color={theme.windowColor} size={56} />
          <FactWindow glowing={active} color={theme.windowColor} size={56} />
          <FactWindow glowing={active} showGear color={theme.windowColor} size={56} />
        </View>
        {/* Horizontal pipe run */}
        <View style={styles.pipeRow}>
          <View style={[styles.pipeH, { backgroundColor: '#3C3C3C' }]} />
          <View style={[styles.pipeValve, { borderColor: '#555' }]} />
          <View style={[styles.pipeH, { flex: 1, backgroundColor: '#444' }]} />
          <View style={[styles.pipeTee, { backgroundColor: '#3A3A3A' }]} />
          <View style={[styles.pipeH, { flex: 1, backgroundColor: '#3C3C3C' }]} />
          <View style={[styles.pipeElbow, { backgroundColor: '#3A3A3A' }]} />
        </View>
        {/* Upper warning sign */}
        <View style={[styles.warnSign, { left: SW * 0.05, borderColor: '#FFB800' }]}>
          <Text style={styles.warnText}>! FABRIKSZON</Text>
        </View>
        {/* Fire extinguisher */}
        <View style={styles.extinguisher}>
          <View style={[styles.extBody, { backgroundColor: '#AA1111' }]} />
          <View style={[styles.extHead, { backgroundColor: '#CC2222' }]} />
          <View style={styles.extHose} />
        </View>
      </View>

      {/* Tier 1: electric arcs between machines */}
      {tier >= 1 && active && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <ElectricArc x1={SW * 0.22} x2={SW * 0.48} y={172} color={theme.accent} />
          <ElectricArc x1={SW * 0.55} x2={SW * 0.78} y={168} color={theme.accent} />
        </View>
      )}

      {/* ══════════ WORKING FLOOR ══════════ */}
      <View style={[styles.workingFloor, { backgroundColor: darken(theme.buildingBody, 18) }]}>
        {/* LEFT — industrial tank + gears */}
        <View style={styles.leftZone}>
          <Tank color={theme.accent} />
          <View style={styles.gearStack}>
            <GearSpinner size={26} color={theme.accent} speed={active ? 1200 : 5000} />
            <GearSpinner size={18} color={darken(theme.accent)} speed={active ? 800 : 3500} counterClockwise />
          </View>
          {/* Vertical pipe on left wall */}
          <View style={[styles.pipeV, { backgroundColor: '#404040', left: 4 }]} />
          <View style={[styles.pipeV, { backgroundColor: '#383838', left: 14 }]} />
        </View>

        {/* CENTER — BUSSE working + box pile */}
        <View style={styles.centerZone}>
          {/* Box pile at right (where BUSSE picks up) */}
          <View style={styles.boxPileWrap}>
            <BoxStack />
          </View>
          <BusseRobot color={theme.accent} hardHat={hasHardHat} worldId={worldId} />
        </View>

        {/* RIGHT — control panel + smaller gear */}
        <View style={styles.rightZone}>
          <ControlPanel accent={theme.accent} active={active} />
          <View style={[styles.pipeV, { backgroundColor: '#404040', right: 4 }]} />
        </View>
      </View>

      {/* ══════════ CONVEYOR BELT ══════════ */}
      <View style={styles.beltWrap}>
        {/* Belt support structure */}
        <View style={[styles.beltFrame, { backgroundColor: '#2A2A2A' }]} />
        <ConveyorBelt
          width={SW}
          color={active ? '#555' : '#333'}
          stripeColor={active ? theme.accent : '#444'}
          active={active}
        />
        {/* Belt legs */}
        {[SW*0.1, SW*0.35, SW*0.6, SW*0.85].map((x,i) => (
          <View key={i} style={[styles.beltLeg, { left: x }]} />
        ))}
        {/* Steam vent under belt */}
        <SteamPuff x={SW * 0.5} active={active} />
      </View>

      {/* ══════════ FLOOR (foreground, perspective) ══════════ */}
      <View style={[styles.floor, { backgroundColor: darken(theme.ground, 10) }]}>
        {/* Tier 2: nano-particles floating up */}
        {tier >= 2 && active && [0, 1, 2, 3, 4].map(i => (
          <NanoParticle key={i} x={SW * (0.1 + i * 0.18)} delay={i * 600} color={theme.accent} />
        ))}
        {/* Tier 3: rocket exhausts at floor level */}
        {tier >= 3 && (
          <>
            <RocketExhaust x={SW * 0.2} active={active} />
            <RocketExhaust x={SW * 0.5} active={active} />
            <RocketExhaust x={SW * 0.8} active={active} />
          </>
        )}
        {/* Perspective grid lines */}
        {[...Array(8)].map((_,i) => (
          <View key={i} style={[styles.floorLineV, { left: `${i * 13}%` as any, opacity: 0.15 + i * 0.02 }]} />
        ))}
        {[...Array(3)].map((_,i) => (
          <View key={i} style={[styles.floorLineH, { bottom: i * 12, opacity: 0.15 + i * 0.04 }]} />
        ))}
        {/* Safety stripe */}
        <View style={styles.safetyStripe}>
          {[...Array(16)].map((_,i) => (
            <View key={i} style={[styles.safetyCell, { backgroundColor: i%2===0 ? theme.accent : '#1A1A1A' }]} />
          ))}
        </View>
        {/* World floor props — right side */}
        <View style={styles.floorPropsWrap}>
          <WorldFloorProps worldId={worldId} accent={theme.accent} active={active} />
        </View>
        {/* Bosse — bigger + centered-left */}
        <View style={styles.bosseWrap}>
          <BosseCharacter tapping={tapping} size={52} relaxing={bossRelaxing} worldId={worldId} />
        </View>
        {/* Floor drain */}
        <View style={styles.drain}>
          {[0,1,2].map(i=><View key={i} style={styles.drainSlot}/>)}
        </View>
      </View>

    </View>
  )
}

// ─── World-specific floor props ───────────────────────────────────────────────
function Barrel({ color = '#5A3A14', stripe = '#FFB800' }) {
  return (
    <View style={{ alignItems:'center' }}>
      <View style={{ width:18, height:22, backgroundColor:color, borderRadius:3, overflow:'hidden', borderWidth:1, borderColor:'#333' }}>
        <View style={{ position:'absolute', top:5, left:0, right:0, height:2, backgroundColor:stripe, opacity:0.7 }} />
        <View style={{ position:'absolute', top:15, left:0, right:0, height:2, backgroundColor:stripe, opacity:0.7 }} />
        <View style={{ position:'absolute', top:0, bottom:0, left:'40%', width:2, backgroundColor:'rgba(255,255,255,0.1)' }} />
      </View>
      <View style={{ width:20, height:3, backgroundColor:darken(color,20), borderRadius:1 }} />
    </View>
  )
}

function Crate({ color = '#8B6010', size = 20 }) {
  return (
    <View style={{ width:size, height:size, backgroundColor:color, borderWidth:1, borderColor:'#C4A000', borderRadius:1 }}>
      <View style={{ position:'absolute', top:'50%', left:0, right:0, height:1, backgroundColor:'#C4A000', opacity:0.6 }} />
      <View style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, backgroundColor:'#C4A000', opacity:0.6 }} />
    </View>
  )
}

function GlowOrb({ color }: { color: string }) {
  const glow = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1,   duration: 1000, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0.4, duration: 1000, useNativeDriver: false }),
    ])).start()
  }, [])
  return (
    <Animated.View style={{ width:14, height:14, borderRadius:7, backgroundColor:color, opacity:glow,
      shadowColor:color, shadowOpacity:0.9, shadowRadius:8, elevation:4 }} />
  )
}

function WorldFloorProps({ worldId, accent, active }: { worldId: number; accent: string; active: boolean }) {
  switch(worldId) {
    case 0: return ( // Rust Factory: barrels + toolbox
      <View style={styles.floorPropsRow}>
        <Barrel />
        <Barrel color="#3A3A3A" stripe="#FF4444" />
        <View style={{ width:24, height:16, backgroundColor:'#444', borderRadius:2, borderWidth:1, borderColor:'#666' }}>
          <View style={{ position:'absolute', top:-5, left:'30%', width:12, height:5, backgroundColor:'#555', borderRadius:2 }} />
        </View>
      </View>
    )
    case 1: return ( // Energy: power cells + warning sign
      <View style={styles.floorPropsRow}>
        <View style={{ alignItems:'center', gap:2 }}>
          <GlowOrb color={accent} />
          <View style={{ width:10, height:24, backgroundColor:darken(accent,30), borderRadius:5, borderWidth:1, borderColor:accent }} />
        </View>
        <View style={{ alignItems:'center', gap:2 }}>
          <GlowOrb color={accent} />
          <View style={{ width:10, height:18, backgroundColor:darken(accent,30), borderRadius:5, borderWidth:1, borderColor:accent }} />
        </View>
        <View style={{ width:20, height:20, backgroundColor:'#1A1A00', borderWidth:2, borderColor:'#FFB800', borderRadius:2, justifyContent:'center', alignItems:'center' }}>
          <View style={{ width:3, height:10, backgroundColor:'#FFB800', borderRadius:1 }} />
          <View style={{ width:3, height:3, backgroundColor:'#FFB800', borderRadius:2, marginTop:2 }} />
        </View>
      </View>
    )
    case 2: return ( // Lab: specimen jars
      <View style={styles.floorPropsRow}>
        {[accent, '#00FFAA', '#FF66AA'].map((c,i) => (
          <View key={i} style={{ alignItems:'center' }}>
            <View style={{ width:12, height:20+i*4, backgroundColor:'rgba(200,240,255,0.15)', borderWidth:1.5, borderColor:'#AACCFF', borderRadius:3, overflow:'hidden' }}>
              <View style={{ position:'absolute', bottom:0, left:0, right:0, height:`${40+i*15}%`, backgroundColor:c, opacity:0.5 }} />
            </View>
            <View style={{ width:14, height:3, backgroundColor:'#888', borderRadius:1 }} />
          </View>
        ))}
      </View>
    )
    case 3: return ( // Space: floating equipment, meteor
      <View style={styles.floorPropsRow}>
        <View style={{ width:20, height:20, backgroundColor:'#333', borderRadius:10, borderWidth:2, borderColor:'#5588CC' }}>
          <View style={{ position:'absolute', top:4, left:4, width:8, height:8, borderRadius:4, backgroundColor:'#222', borderWidth:1, borderColor:'#88AAFF' }} />
        </View>
        <View style={{ width:16, height:14, backgroundColor:'#4A3A2A', borderRadius:3, transform:[{rotate:'20deg'}] }}>
          <View style={{ position:'absolute', top:2, left:2, width:4, height:4, borderRadius:2, backgroundColor:'#2A1A0A' }} />
        </View>
        <GlowOrb color="#4488FF" />
      </View>
    )
    case 4: return ( // Viking: mead barrel + shield + axe
      <View style={styles.floorPropsRow}>
        <Barrel color="#5A3A00" stripe="#C8860A" />
        <View style={{ width:22, height:22, borderRadius:11, backgroundColor:'#5A3A14', borderWidth:3, borderColor:'#C8860A' }}>
          <View style={{ position:'absolute', top:8, left:8, width:6, height:6, borderRadius:3, backgroundColor:'#C8860A' }} />
        </View>
        <View style={{ width:6, height:28, backgroundColor:'#5A3A14', borderRadius:2 }}>
          <View style={{ position:'absolute', top:0, left:-8, width:14, height:10, backgroundColor:'#888', borderRadius:2 }} />
        </View>
      </View>
    )
    case 5: return ( // Dino: bones + fern + eggs
      <View style={styles.floorPropsRow}>
        <View style={{ gap:2 }}>
          <View style={{ width:24, height:6, backgroundColor:'#D4C090', borderRadius:3 }}>
            <View style={{ position:'absolute', left:-4, top:-3, width:10, height:10, borderRadius:5, backgroundColor:'#D4C090', borderWidth:1, borderColor:'#A89060' }} />
            <View style={{ position:'absolute', right:-4, top:-3, width:10, height:10, borderRadius:5, backgroundColor:'#D4C090', borderWidth:1, borderColor:'#A89060' }} />
          </View>
        </View>
        {[0,1].map(i => (
          <View key={i} style={{ width:16, height:20, backgroundColor:'#8B7440', borderRadius:8, borderWidth:1, borderColor:'#A89060', transform:[{scaleX:0.85}] }} />
        ))}
      </View>
    )
    case 6: return ( // Ocean: diving tank + treasure chest + fish tank
      <View style={styles.floorPropsRow}>
        <View style={{ alignItems:'center' }}>
          <View style={{ width:14, height:28, backgroundColor:'#444', borderRadius:7, borderWidth:1, borderColor:'#666' }}>
            <View style={{ position:'absolute', top:4, left:2, right:2, height:3, backgroundColor:'#888', borderRadius:1 }} />
          </View>
          <View style={{ width:10, height:3, backgroundColor:'#333', borderRadius:1 }} />
        </View>
        <View style={{ width:24, height:18, backgroundColor:'#5A3A14', borderWidth:1, borderColor:'#C8860A', borderRadius:2 }}>
          <View style={{ position:'absolute', top:-4, left:6, right:6, height:4, backgroundColor:'#5A3A14', borderRadius:1 }} />
          <View style={{ position:'absolute', top:4, left:4, right:4, height:2, backgroundColor:'#C8860A', borderRadius:1, opacity:0.5 }} />
        </View>
        <GlowOrb color={accent} />
      </View>
    )
    case 7: return ( // Fire: lava bucket + heat shield + ember
      <View style={styles.floorPropsRow}>
        <View style={{ alignItems:'center' }}>
          <View style={{ width:16, height:18, backgroundColor:'#222', borderRadius:2, borderWidth:1, borderColor:'#555' }}>
            <View style={{ position:'absolute', bottom:0, left:0, right:0, height:8, backgroundColor:'#FF4400', opacity:0.8, borderRadius:1 }} />
            {active && <GlowOrb color="#FF6600" />}
          </View>
          <View style={{ width:12, height:3, backgroundColor:'#333', borderRadius:1 }} />
        </View>
        <View style={{ width:20, height:26, backgroundColor:'#882200', borderRadius:2, borderWidth:1, borderColor:'#FF5500' }}>
          <View style={{ position:'absolute', top:4, left:4, right:4, height:2, backgroundColor:'#FF5500', opacity:0.4 }} />
          <View style={{ position:'absolute', top:10, left:4, right:4, height:2, backgroundColor:'#FF5500', opacity:0.4 }} />
        </View>
      </View>
    )
    case 8: return ( // Jungle: idol + torch + treasure
      <View style={styles.floorPropsRow}>
        <View style={{ alignItems:'center' }}>
          <View style={{ width:10, height:28, backgroundColor:'#3A5A18', borderRadius:2 }}>
            <View style={{ width:10, height:8, backgroundColor:'#2A4A10', borderRadius:5, marginTop:0 }} />
            <View style={{ position:'absolute', top:10, left:1, width:2, height:2, backgroundColor:'#00CC55' }} />
            <View style={{ position:'absolute', top:14, right:1, width:2, height:2, backgroundColor:'#00CC55' }} />
          </View>
        </View>
        <View style={{ alignItems:'center' }}>
          <View style={{ width:6, height:3, backgroundColor:'#FF8800', borderRadius:3, opacity:active?0.9:0.2 }} />
          <View style={{ width:3, height:20, backgroundColor:'#5A3A14', borderRadius:1 }} />
        </View>
        <View style={{ width:22, height:16, backgroundColor:'#8B6010', borderRadius:2, borderWidth:1, borderColor:'#C4A000' }}>
          <View style={{ position:'absolute', top:-4, left:4, right:4, height:4, backgroundColor:'#8B6010', borderRadius:1 }} />
        </View>
      </View>
    )
    case 9: return ( // Cyberpunk: server rack + holo terminal + neon
      <View style={styles.floorPropsRow}>
        <View style={{ width:18, height:32, backgroundColor:'#111122', borderRadius:2, borderWidth:1, borderColor:accent, gap:3, paddingTop:3, paddingHorizontal:2 }}>
          {[0,1,2,3].map(i => <View key={i} style={{ flexDirection:'row', gap:2, justifyContent:'center' }}>
            <GlowOrb color={i%2===0?accent:'#00FFFF'} />
            <View style={{ flex:1, height:4, backgroundColor:'#333', borderRadius:1, marginTop:5 }} />
          </View>)}
        </View>
        <View style={{ width:16, height:20, backgroundColor:'rgba(255,0,204,0.1)', borderWidth:1, borderColor:accent, borderRadius:2, justifyContent:'center', alignItems:'center' }}>
          <GlowOrb color={accent} />
          <View style={{ width:10, height:1, backgroundColor:accent, marginTop:3, opacity:0.6 }} />
          <View style={{ width:8, height:1, backgroundColor:accent, marginTop:2, opacity:0.4 }} />
        </View>
      </View>
    )
    default: return null
  }
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scene: { flex: 1, width: SW },

  // ── Ceiling
  ceiling: {
    height: 72,
    width: SW,
    position: 'relative',
    overflow: 'visible',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  beam: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 16,
    backgroundColor: '#1A1A1A',
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#2A2A2A',
  },
  duct: {
    position: 'absolute',
    top: 8, left: SW*0.2, right: SW*0.2,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ductBand: { width: 1, height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', marginLeft: 18 },
  ductGrill: {
    position: 'absolute',
    bottom: 0, left: '40%', right: '40%',
    height: 8,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#444',
  },
  pendant: {
    position: 'absolute',
    top: 0,
    width: 28,
    alignItems: 'center',
  },
  pendantCord: { width: 2, height: 26, backgroundColor: '#555' },
  pendantCone: {
    width: 26, height: 14,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderTopWidth: 0,
    marginTop: -1,
    borderWidth: 1,
    borderColor: '#555',
  },
  pendantGlow: {
    width: 44, height: 22,
    borderRadius: 22,
    backgroundColor: '#FFFFAA',
    marginTop: 1,
    opacity: 0.4,
  },
  emergencyLight: {
    position: 'absolute',
    right: 12, top: 10,
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: '#1A0000',
    borderWidth: 1,
    borderColor: '#550000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Upper wall
  upperWall: {
    width: SW,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  wallBand: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    borderBottomWidth: 1,
  },
  winRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 4,
  },
  // Window
  win: { position: 'relative' },
  winShadow: {
    position: 'absolute',
    bottom: -4, right: -4,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 2,
  },
  winFrame: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 6,
    backgroundColor: '#111',
    borderWidth: 3,
    borderColor: '#444',
    borderRadius: 2,
    overflow: 'hidden',
  },
  winBarH: {
    position: 'absolute', left: 0, right: 0, top: '50%',
    height: 2, backgroundColor: 'rgba(0,0,0,0.45)', marginTop: -1,
  },
  winBarV: {
    position: 'absolute', top: 0, bottom: 0, left: '50%',
    width: 2, backgroundColor: 'rgba(0,0,0,0.45)', marginLeft: -1,
  },
  winGear: { position: 'absolute', bottom: 3, right: 3, opacity: 0.65 },
  winLedge: {
    position: 'absolute', bottom: -2, left: -4, right: -4,
    height: 5, backgroundColor: '#333', borderRadius: 1,
  },
  // Pipe row
  pipeRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, marginTop: 2,
  },
  pipeH: { height: 8, width: 28, borderRadius: 4 },
  pipeValve: {
    width: 18, height: 14,
    borderRadius: 3, backgroundColor: '#2A2A2A',
    borderWidth: 2,
    marginHorizontal: 4,
  },
  pipeTee: { width: 10, height: 20, borderRadius: 3, marginHorizontal: 4 },
  pipeElbow: { width: 14, height: 14, borderRadius: 7, marginHorizontal: 4 },
  warnSign: {
    position: 'absolute',
    top: 5,
    paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  warnText: { fontSize: 8, fontFamily: 'Courier New', color: '#FFB800', fontWeight: 'bold' },
  extinguisher: {
    position: 'absolute',
    right: 8, bottom: 4,
    alignItems: 'center',
  },
  extBody: { width: 12, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#CC3333' },
  extHead: { width: 10, height: 6, borderRadius: 3, marginBottom: 1 },
  extHose: { width: 2, height: 10, backgroundColor: '#333', borderRadius: 1, transform: [{ rotate: '30deg' }] },

  // ── Working floor
  workingFloor: {
    flexDirection: 'row',
    height: 100,
    width: SW,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  leftZone: {
    width: SW * 0.26,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    paddingLeft: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  centerZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 4,
    paddingHorizontal: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  boxPileWrap: {
    position: 'absolute',
    right: 6,
    bottom: 4,
  },
  rightZone: {
    width: SW * 0.28,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    paddingRight: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  // Tank
  tank: { alignItems: 'center', marginBottom: 4 },
  tankBody: {
    width: 38, height: 54,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  tankRivetRow: { flexDirection: 'row', gap: 10, marginVertical: 1 },
  tankRivet: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  tankWindow: {
    width: 16, height: 22,
    backgroundColor: '#0A1A0A',
    borderWidth: 1, borderColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  tankLiquid: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%' },
  tankBubble: {
    position: 'absolute',
    bottom: 8,
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  gauge: {
    position: 'absolute',
    bottom: 4, right: 4,
    width: 14, height: 14,
    borderRadius: 7,
    backgroundColor: '#222',
    borderWidth: 1, borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeFace: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A2A1A' },
  gaugeNeedle: { position: 'absolute', width: 1.5, height: 5, backgroundColor: '#FF4444', bottom: '50%', left: '50%' },
  tankCap: { width: 44, height: 6, borderRadius: 3, marginBottom: -2, zIndex: 1 },
  tankPipeH: { width: 16, height: 5, borderRadius: 2, marginTop: 2 },
  gearStack: { flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 4 },
  pipeV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 6,
    borderRadius: 3,
  },
  // Control panel
  cpOuter: { alignItems: 'center', width: '100%' },
  cpLabel: { fontSize: 7, fontFamily: 'Courier New', fontWeight: 'bold', letterSpacing: 1, marginBottom: 3 },
  cpBody: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
    gap: 5,
    width: '92%',
  },
  cpGauges: { flexDirection: 'row', gap: 5 },
  cpGauge: { alignItems: 'center' },
  cpGaugeFace: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#0A1A0A',
    borderWidth: 1.5, borderColor: '#444',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  cpGaugeNeedle: {
    position: 'absolute',
    width: 2, height: 8,
    backgroundColor: '#FF4444',
    bottom: '45%', left: '45%',
    borderRadius: 1,
  },
  cpGaugeLbl: { fontSize: 6, fontFamily: 'Courier New', color: '#555', marginTop: 1 },
  cpLights: { flexDirection: 'row', gap: 5 },
  cpBtns: { flexDirection: 'row', gap: 5 },
  cpBtn: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  // Boxes 3D
  boxRow2: { flexDirection: 'row', gap: 2, marginBottom: 2 },
  boxRow3: { flexDirection: 'row', gap: 2 },
  b3d: { width: 20, height: 16, position: 'relative' },
  b3dFront: { position:'absolute', bottom:0, left:0, width:16, height:13, borderWidth:1, borderColor:'#C4A000', borderRadius:1 },
  b3dTop:   { position:'absolute', bottom:13, left:3, width:16, height:5,  borderWidth:1, borderColor:'#C4A000', transform:[{skewX:'30deg'}] },
  b3dSide:  { position:'absolute', bottom:1, left:16, width:4, height:11, borderWidth:1, borderColor:'#7B5000', transform:[{skewY:'-30deg'}] },

  // ── Belt
  beltWrap: { width: SW, position: 'relative', overflow: 'visible' },
  beltFrame: { height: 5, width: SW },
  beltLeg: {
    position: 'absolute',
    bottom: -12, width: 8, height: 14,
    backgroundColor: '#2A2A2A',
    borderRadius: 1,
  },

  // ── Floor
  floor: {
    flex: 1,
    width: SW,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 44,
  },
  floorLineV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  floorLineH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  safetyStripe: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  safetyCell: { flex: 1 },
  bosseWrap: {
    position: 'absolute',
    bottom: 0, left: 20,
    zIndex: 5,
  },
  // ── Outdoor world layout ──
  outdoorWorkZone: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  outdoorBusseWrap: {
    position: 'absolute',
    bottom: 10,
    left: SW * 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  floorPropsWrap: {
    position: 'absolute',
    bottom: 4, right: 10,
    zIndex: 4,
  },
  floorPropsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  drain: {
    position: 'absolute',
    bottom: 6, right: 20,
    width: 18, height: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    borderWidth: 1, borderColor: '#333',
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drainSlot: { width: 2, height: 7, backgroundColor: '#333', borderRadius: 1 },
  // Steam
  ventWrap: { position: 'absolute', bottom: 0, width: 16, alignItems: 'center' },
  ventPuff: { position: 'absolute', bottom: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: '#AAAAAA' },
  ventHole: { width: 12, height: 5, backgroundColor: '#1A1A1A', borderRadius: 2, borderWidth: 1, borderColor: '#333' },
})
