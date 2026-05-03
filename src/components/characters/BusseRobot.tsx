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

  // Walking leg oscillation (simple 2-state toggle via interpolation off posX)
  const legSwing = posX.interpolate({
    inputRange: [0, 10, 20, 30, 40, 50, 62],
    outputRange: [0, 8, 0, -8, 0, 8, 0],
    extrapolate: 'clamp',
  })
  const leftLegRot = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['14deg', '0deg', '-14deg'] })
  const rightLegRot = legSwing.interpolate({ inputRange: [-10, 0, 10], outputRange: ['-14deg', '0deg', '14deg'] })

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
