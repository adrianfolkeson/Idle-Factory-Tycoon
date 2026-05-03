import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, View, StyleSheet } from 'react-native'

interface Props {
  color?: string
  beltX?: number
  hardHat?: boolean
  worldId?: number
}

// BUSSE work cycle:
// 1. Walk right to box pile
// 2. Reach arm down, pick up box
// 3. Stand up carrying box
// 4. Walk left to belt, face left
// 5. Extend arm, place box on belt
// 6. Arm returns, walk back right
// Repeat forever

const ROBOT_W = 44
const ROBOT_H = 68
const ARM_W = 9
const ARM_H = 24
const BOX_W = 16
const BOX_H = 12

export default function BusseRobot({ color = '#8B6914', beltX = 10, hardHat = false, worldId = 0 }: Props) {
  const posX       = useRef(new Animated.Value(0)).current
  const armAngle   = useRef(new Animated.Value(0)).current  // degrees
  const boxOpacity = useRef(new Animated.Value(0)).current
  const [facingRight, setFacingRight] = useState(true)
  const timeouts   = useRef<ReturnType<typeof setTimeout>[]>([])
  const mounted    = useRef(true)

  const clearTimeouts = () => timeouts.current.forEach(clearTimeout)

  const t = (ms: number, fn: () => void) => {
    if (!mounted.current) return
    timeouts.current.push(setTimeout(() => { if (mounted.current) fn() }, ms))
  }

  const startCycle = useCallback(() => {
    clearTimeouts()
    timeouts.current = []

    // --- Walk right to the box pile ---
    Animated.timing(posX, { toValue: 62, duration: 1600, useNativeDriver: false }).start()

    t(1600, () => {
      // Reach arm down to grab box
      Animated.timing(armAngle, { toValue: 78, duration: 380, useNativeDriver: false }).start()
    })
    t(1980, () => {
      // Box snaps into hand
      Animated.timing(boxOpacity, { toValue: 1, duration: 130, useNativeDriver: false }).start()
      // Arm pulls back carrying box
      Animated.timing(armAngle, { toValue: -18, duration: 320, useNativeDriver: false }).start()
    })
    t(2350, () => {
      // Flip to face left and walk to belt
      setFacingRight(false)
      Animated.timing(posX, { toValue: 0, duration: 1600, useNativeDriver: false }).start()
    })
    t(3950, () => {
      // Extend arm to place box on belt
      Animated.timing(armAngle, { toValue: 65, duration: 380, useNativeDriver: false }).start()
    })
    t(4180, () => {
      // Release box
      Animated.timing(boxOpacity, { toValue: 0, duration: 150, useNativeDriver: false }).start()
    })
    t(4330, () => {
      // Arm back to neutral
      Animated.timing(armAngle, { toValue: 0, duration: 280, useNativeDriver: false }).start()
    })
    t(4650, () => {
      setFacingRight(true)
    })
    t(5000, () => {
      startCycle()
    })
  }, [posX, armAngle, boxOpacity])

  useEffect(() => {
    mounted.current = true
    startCycle()
    return () => {
      mounted.current = false
      clearTimeouts()
    }
  }, [startCycle])

  const armDeg = armAngle.interpolate({ inputRange: [-25, 0, 90], outputRange: ['-25deg', '0deg', '90deg'] })
  const scaleX = facingRight ? 1 : -1

  // Walking leg oscillation
  const legSwing = posX.interpolate({
    inputRange: [0, 10, 20, 30, 40, 50, 62],
    outputRange: [0, 8, 0, -8, 0, 8, 0],
    extrapolate: 'clamp',
  })
  const leftLegRot  = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['14deg',  '0deg', '-14deg'] })
  const rightLegRot = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['-14deg', '0deg',  '14deg'] })

  // ── World 5: BUSSE TRICERATOPS-ROBOT ──────────────────────────────────────────
  if (worldId === 5) {
    const leg1 = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['18deg',  '0deg', '-18deg'] })
    const leg2 = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['-18deg', '0deg',  '18deg'] })
    const bodyBob = posX.interpolate({
      inputRange: [0, 16, 32, 48, 62],
      outputRange: [0, -3, 0, -3, 0],
      extrapolate: 'clamp',
    })
    return (
      <Animated.View style={{ transform: [{ translateX: posX }, { translateY: bodyBob }] }}>
        <View style={{ alignItems: 'center', transform: [{ scaleX }] }}>
          {/* ── Frill collar ── */}
          <View style={{ width: 52, height: 16, backgroundColor: '#2A4A1A', borderRadius: 8, marginBottom: -6, zIndex: 2 }}>
            {[0,1,2,3,4].map(i => (
              <View key={i} style={{ position:'absolute', top:-8, left:4+i*9, width:8, height:12, backgroundColor:'#1A3A0A', borderRadius:4 }} />
            ))}
          </View>
          {/* ── Head ── */}
          <View style={{ width: 40, height: 24, backgroundColor: '#3A6020', borderRadius: 5, zIndex: 3 }}>
            {/* 3 horns */}
            <View style={{ position:'absolute', top:-18, left:14, width:10, height:20, backgroundColor:'#C8A050', borderRadius:4, transform:[{rotate:'3deg'}] }} />
            <View style={{ position:'absolute', top:-10, left:2,  width:7,  height:13, backgroundColor:'#B89040', borderRadius:3, transform:[{rotate:'-20deg'}] }} />
            <View style={{ position:'absolute', top:-10, right:3, width:7,  height:12, backgroundColor:'#B89040', borderRadius:3, transform:[{rotate:'20deg'}] }} />
            {/* Eyes */}
            <View style={{ position:'absolute', top:7, left:4, width:9, height:9, borderRadius:5, backgroundColor:'#FFAA00', borderWidth:1, borderColor:'#886600' }}>
              <View style={{ position:'absolute', top:1, left:1, width:7, height:7, borderRadius:4, backgroundColor:'#111' }} />
            </View>
            <View style={{ position:'absolute', top:7, right:4, width:9, height:9, borderRadius:5, backgroundColor:'#FFAA00', borderWidth:1, borderColor:'#886600' }}>
              <View style={{ position:'absolute', top:1, left:1, width:7, height:7, borderRadius:4, backgroundColor:'#111' }} />
            </View>
            {/* Beak */}
            <View style={{ position:'absolute', bottom:3, left:6, right:6, height:5, backgroundColor:'#8B6914', borderRadius:2 }} />
          </View>
          {/* Neck */}
          <View style={{ width:16, height:5, backgroundColor:'#2A5018', borderRadius:2 }} />
          {/* ── Body ── */}
          <View style={{ width:44, height:30, backgroundColor:'#2A5018', borderRadius:5, position:'relative' }}>
            <View style={{ position:'absolute', top:3,  left:3,  width:18, height:10, backgroundColor:'#1A4010', borderRadius:3 }} />
            <View style={{ position:'absolute', top:3,  right:3, width:18, height:10, backgroundColor:'#1A4010', borderRadius:3 }} />
            <View style={{ position:'absolute', bottom:4, left:7, right:7, height:9, backgroundColor:'#1A4010', borderRadius:3 }} />
            {/* Arm for picking boxes */}
            <Animated.View style={{ position:'absolute', right:-8, top:4, transform:[{rotate:armDeg}] }}>
              <View style={{ width:9, height:22, backgroundColor:'#2A5018', borderRadius:3 }}>
                <View style={{ width:11, height:6, backgroundColor:'#1A4010', borderRadius:2 }} />
              </View>
              <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2, opacity:boxOpacity }}>
                <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#8B5E0A', borderRadius:1, borderWidth:1, borderColor:'#C4A000' }} />
              </Animated.View>
            </Animated.View>
          </View>
          {/* Tail */}
          <View style={{ position:'absolute', bottom:18, left:-14, width:20, height:10, backgroundColor:'#2A5018', borderRadius:5, transform:[{rotate:'-25deg'}] }} />
          {/* ── 4 legs ── */}
          <View style={{ flexDirection:'row', gap:3, marginTop:1 }}>
            {[leg1, leg2, leg1, leg2].map((rot, i) => (
              <Animated.View key={i} style={{ width:10, height:14, backgroundColor:'#2A5018', borderRadius:3, transform:[{rotate:rot}] }}>
                <View style={{ position:'absolute', bottom:-4, left:-2, width:14, height:6, backgroundColor:'#1A4010', borderRadius:2 }} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  }

  // ── World 6: BUSSE ROBOT-GOLDFISH ─────────────────────────────────────────────
  if (worldId === 6) {
    const tailWag = posX.interpolate({
      inputRange: [0, 8, 16, 24, 32, 40, 50, 62],
      outputRange: ['-20deg', '20deg', '-20deg', '20deg', '-20deg', '20deg', '-20deg', '20deg'],
      extrapolate: 'clamp',
    })
    const bodyBob = posX.interpolate({
      inputRange: [0, 15, 30, 45, 62],
      outputRange: [0, -4, 0, -4, 0],
      extrapolate: 'clamp',
    })
    const finWag = posX.interpolate({
      inputRange: [0, 31, 62],
      outputRange: ['10deg', '-10deg', '10deg'],
      extrapolate: 'clamp',
    })
    return (
      <Animated.View style={{ transform: [{ translateX: posX }, { translateY: bodyBob }] }}>
        <View style={{ transform: [{ scaleX }] }}>
          {/* ── Tail fin ── */}
          <View style={{ position:'absolute', top:8, left:-18, flexDirection:'column', gap:2 }}>
            <Animated.View style={{ transform:[{rotate:tailWag}] }}>
              <View style={{ width:0, height:0, borderTopWidth:10, borderBottomWidth:10, borderRightWidth:18, borderTopColor:'transparent', borderBottomColor:'transparent', borderRightColor:'#CC5500' }} />
            </Animated.View>
            <Animated.View style={{ transform:[{rotate:tailWag},{scaleY:-1}] }}>
              <View style={{ width:0, height:0, borderTopWidth:8, borderBottomWidth:8, borderRightWidth:14, borderTopColor:'transparent', borderBottomColor:'transparent', borderRightColor:'#FF6600' }} />
            </Animated.View>
          </View>
          {/* ── Main body (oval fish) ── */}
          <View style={{ width:42, height:30, backgroundColor:'#FF7700', borderRadius:15, overflow:'hidden', borderWidth:1, borderColor:'#CC5500' }}>
            {/* Scale shimmer */}
            {[0,1,2].map(i => (
              <View key={i} style={{ position:'absolute', top:4+i*7, left:4+i*5, width:12, height:8, backgroundColor:'#FFA500', borderRadius:6, opacity:0.4 }} />
            ))}
            {/* Metallic belly */}
            <View style={{ position:'absolute', bottom:2, left:8, right:8, height:10, backgroundColor:'#FFD700', borderRadius:5, opacity:0.5 }} />
            {/* Robot eye (large, mechanical) */}
            <View style={{ position:'absolute', top:7, right:5, width:14, height:14, borderRadius:7, backgroundColor:'#CCDDFF', borderWidth:2, borderColor:'#8899CC' }}>
              <View style={{ position:'absolute', top:2, left:2, width:10, height:10, borderRadius:5, backgroundColor:'#1144AA' }}>
                <View style={{ position:'absolute', top:2, left:2, width:6, height:6, borderRadius:3, backgroundColor:'#4488FF' }} />
                <View style={{ position:'absolute', top:1, right:1, width:2, height:2, borderRadius:1, backgroundColor:'#FFFFFF' }} />
              </View>
            </View>
            {/* Mouth grill */}
            <View style={{ position:'absolute', bottom:5, right:4, width:8, height:5, backgroundColor:'#884400', borderRadius:2, overflow:'hidden' }}>
              {[0,1].map(i => <View key={i} style={{ position:'absolute', top:1+i*2, left:0, right:0, height:1, backgroundColor:'#CC6600' }} />)}
            </View>
          </View>
          {/* ── Dorsal fin ── */}
          <View style={{ position:'absolute', top:-10, left:12 }}>
            <View style={{ width:0, height:0, borderLeftWidth:8, borderRightWidth:8, borderBottomWidth:12, borderLeftColor:'transparent', borderRightColor:'transparent', borderBottomColor:'#FF5500' }} />
          </View>
          {/* ── Pectoral fin ── */}
          <Animated.View style={{ position:'absolute', top:18, left:8, transform:[{rotate:finWag}] }}>
            <View style={{ width:14, height:8, backgroundColor:'#FF6600', borderRadius:4, opacity:0.85 }} />
          </Animated.View>
          {/* ── Carry box (held near mouth) ── */}
          <Animated.View style={{ position:'absolute', right:-BOX_W+2, top:10, opacity:boxOpacity }}>
            <View style={{ width:BOX_W-2, height:BOX_H-2, backgroundColor:'#8B5E0A', borderRadius:1, borderWidth:1, borderColor:'#C4A000' }} />
          </Animated.View>
          {/* ── Propeller tail (mechanical detail) ── */}
          <View style={{ position:'absolute', top:12, left:-6, width:6, height:6, borderRadius:3, backgroundColor:'#888', borderWidth:1, borderColor:'#AAA' }} />
        </View>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={{ transform: [{ translateX: posX }] }}>
      <View style={[styles.robot, { transform: [{ scaleX }] }]}>

        {/* ── HARD HAT (shown when automation upgrade purchased) ── */}
        {hardHat && (
          <View style={styles.hardHat}>
            <View style={styles.hardHatBrim} />
            <View style={styles.hardHatTop} />
          </View>
        )}

        {/* ── ANTENNA (hidden when wearing hard hat) ── */}
        {!hardHat && (
          <View style={styles.antenna}>
            <View style={styles.antennaPole} />
            <View style={[styles.antennaLight, { backgroundColor: color }]} />
          </View>
        )}

        {/* ── HEAD ── */}
        <View style={[styles.head, { backgroundColor: color }]}>
          {/* Eyes */}
          <View style={styles.eyeRow}>
            <View style={styles.eyeOuter}><View style={styles.eyeInner} /></View>
            <View style={styles.eyeOuter}><View style={styles.eyeInner} /></View>
          </View>
          {/* Mouth / speaker grille */}
          <View style={styles.mouthRow}>
            {[0,1,2,3].map(i => <View key={i} style={styles.mouthTooth} />)}
          </View>
        </View>

        {/* ── NECK ── */}
        <View style={styles.neck} />

        {/* ── BODY ── */}
        <View style={[styles.body, { backgroundColor: color }]}>
          {/* Shoulder bolts */}
          <View style={styles.shoulderBoltL} />
          <View style={styles.shoulderBoltR} />
          {/* Chest panel */}
          <View style={styles.chestPanel}>
            <View style={[styles.chestLED, { backgroundColor: '#00FF88' }]} />
            <View style={[styles.chestLED, { backgroundColor: '#FF4444' }]} />
          </View>
          {/* Body details: horizontal vent lines */}
          <View style={styles.ventLines}>
            <View style={styles.vent} />
            <View style={styles.vent} />
            <View style={styles.vent} />
          </View>
        </View>

        {/* ── LEFT ARM (static) ── */}
        <View style={styles.leftArmContainer}>
          <View style={[styles.arm, { backgroundColor: color }]}>
            <View style={styles.armJoint} />
            <View style={[styles.hand, { backgroundColor: '#555' }]} />
          </View>
        </View>

        {/* ── RIGHT ARM (animated — picks up and places) ── */}
        <Animated.View
          style={[
            styles.rightArmContainer,
            {
              transform: [
                { translateY: -(ARM_H / 2) },
                { rotate: armDeg },
                { translateY: ARM_H / 2 },
              ],
            },
          ]}
        >
          <View style={[styles.arm, { backgroundColor: color }]}>
            <View style={styles.armJoint} />
            <View style={[styles.hand, { backgroundColor: '#555' }]} />
          </View>
          {/* Box held in right hand */}
          <Animated.View style={[styles.carryBox, { opacity: boxOpacity }]}>
            <View style={styles.carryBoxFront} />
            <View style={styles.carryBoxTop} />
            <View style={styles.carryBoxSide} />
          </Animated.View>
        </Animated.View>

        {/* ── WAIST ── */}
        <View style={styles.waist} />

        {/* ── LEGS (animated walk) ── */}
        <View style={styles.legsRow}>
          <Animated.View style={[styles.leg, { backgroundColor: color, transform: [{ rotate: leftLegRot }] }]}>
            <View style={styles.wheel} />
          </Animated.View>
          <Animated.View style={[styles.leg, { backgroundColor: color, transform: [{ rotate: rightLegRot }] }]}>
            <View style={styles.wheel} />
          </Animated.View>
        </View>

      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  robot: {
    width: ROBOT_W,
    position: 'relative',
    alignItems: 'center',
  },

  // Hard hat
  hardHat: { alignItems: 'center', marginBottom: 0 },
  hardHatBrim: { width: 34, height: 4, backgroundColor: '#FFB800', borderRadius: 2 },
  hardHatTop:  { width: 24, height: 9, backgroundColor: '#FFB800', borderRadius: 3, marginTop: -2 },

  // Antenna
  antenna: { alignItems: 'center', marginBottom: 1 },
  antennaPole: { width: 3, height: 8, backgroundColor: '#AAAAAA', borderRadius: 1 },
  antennaLight: { width: 7, height: 7, borderRadius: 4, marginTop: -1 },

  // Head
  head: {
    width: 28,
    height: 20,
    borderRadius: 3,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  eyeRow: { flexDirection: 'row', gap: 6 },
  eyeOuter: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  eyeInner: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFFF44' },
  mouthRow: { flexDirection: 'row', gap: 2, paddingHorizontal: 4 },
  mouthTooth: { width: 4, height: 3, backgroundColor: '#444', borderRadius: 1 },

  // Neck
  neck: { width: 10, height: 4, backgroundColor: '#666', borderRadius: 1 },

  // Body
  body: {
    width: ROBOT_W - 4,
    height: 24,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shoulderBoltL: {
    position: 'absolute', left: -2, top: 6,
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#888',
  },
  shoulderBoltR: {
    position: 'absolute', right: -2, top: 6,
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#888',
  },
  chestPanel: {
    width: 16, height: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  chestLED: { width: 4, height: 4, borderRadius: 2 },
  ventLines: {
    position: 'absolute', right: 4, top: 4,
    gap: 3,
  },
  vent: { width: 6, height: 1.5, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 1 },

  // Arms
  leftArmContainer: {
    position: 'absolute',
    left: -ARM_W + 2,
    top: 24 + 4 + 5,   // below neck, at shoulder
  },
  rightArmContainer: {
    position: 'absolute',
    right: -ARM_W + 2,
    top: 24 + 4 + 5,
  },
  arm: {
    width: ARM_W,
    height: ARM_H,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  armJoint: {
    position: 'absolute', top: 6,
    width: ARM_W - 2, height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3,
  },
  hand: { width: ARM_W + 2, height: 6, borderRadius: 3 },

  // Carried box (3D box shape)
  carryBox: {
    position: 'absolute',
    bottom: -BOX_H - 2,
    right: -BOX_W / 2 - 2,
    width: BOX_W,
    height: BOX_H,
  },
  carryBoxFront: {
    position: 'absolute',
    bottom: 0, left: 0,
    width: BOX_W, height: BOX_H,
    backgroundColor: '#8B5E0A',
    borderWidth: 1,
    borderColor: '#C4A000',
    borderRadius: 1,
  },
  carryBoxTop: {
    position: 'absolute',
    bottom: BOX_H - 2, left: 3,
    width: BOX_W, height: 5,
    backgroundColor: '#A07015',
    borderWidth: 1,
    borderColor: '#C4A000',
    transform: [{ skewX: '30deg' }],
  },
  carryBoxSide: {
    position: 'absolute',
    bottom: 1, left: BOX_W - 1,
    width: 5, height: BOX_H - 2,
    backgroundColor: '#5A3A08',
    borderWidth: 1,
    borderColor: '#8B6000',
    transform: [{ skewY: '-30deg' }],
  },

  // Waist
  waist: { width: ROBOT_W - 8, height: 5, backgroundColor: '#444', borderRadius: 2, marginTop: 1 },

  // Legs
  legsRow: { flexDirection: 'row', gap: 6, marginTop: 1 },
  leg: {
    width: 12,
    height: 16,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 1,
  },
  wheel: {
    width: 14, height: 14,
    borderRadius: 7,
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#555',
  },
})
