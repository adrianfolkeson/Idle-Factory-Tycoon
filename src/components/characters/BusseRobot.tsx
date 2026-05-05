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

  // Lava glow for world 7 magma robot (non-native — used for color/opacity props)
  const lavaGlow = useRef(new Animated.Value(0.5)).current
  useEffect(() => {
    if (worldId !== 7) return
    Animated.loop(Animated.sequence([
      Animated.timing(lavaGlow, { toValue: 1,   duration: 500, useNativeDriver: false }),
      Animated.timing(lavaGlow, { toValue: 0.4, duration: 700, useNativeDriver: false }),
    ])).start()
  }, [worldId])

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
              {/* Dino egg */}
              <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2, opacity:boxOpacity }}>
                <View style={{ width:14, height:BOX_H+3, borderRadius:7, backgroundColor:'#88BB44', borderWidth:1.5, borderColor:'#6A9930' }}>
                  <View style={{ position:'absolute', top:3, left:2, width:4, height:4, borderRadius:2, backgroundColor:'#6A9930', opacity:0.6 }} />
                  <View style={{ position:'absolute', top:7, right:2, width:3, height:3, borderRadius:2, backgroundColor:'#6A9930', opacity:0.5 }} />
                </View>
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
          {/* ── Oyster pearl (carried near mouth) ── */}
          <Animated.View style={{ position:'absolute', right:-BOX_W+2, top:10, opacity:boxOpacity }}>
            <View style={{ width:BOX_W, height:BOX_H, borderRadius:3, backgroundColor:'#8B8B7A', borderWidth:1, borderColor:'#AAA990', justifyContent:'center', alignItems:'center' }}>
              <View style={{ width:9, height:9, borderRadius:5, backgroundColor:'#F8F0FF', borderWidth:1, borderColor:'#DDD0EE' }}>
                <View style={{ position:'absolute', top:1, left:1, width:3, height:3, borderRadius:2, backgroundColor:'rgba(255,255,255,0.7)' }} />
              </View>
            </View>
          </Animated.View>
          {/* ── Propeller tail (mechanical detail) ── */}
          <View style={{ position:'absolute', top:12, left:-6, width:6, height:6, borderRadius:3, backgroundColor:'#888', borderWidth:1, borderColor:'#AAA' }} />
        </View>
      </Animated.View>
    )
  }

  // ── World 2: BUSSE LAB-ROBOT ──────────────────────────────────────────────────
  if (worldId === 2) {
    return (
      <Animated.View style={{ transform:[{translateX:posX}] }}>
        <View style={{ alignItems:'center', transform:[{scaleX}] }}>
          {/* Lab head — white chrome with magnifying visor */}
          <View style={{ width:28, height:22, backgroundColor:'#E8EEF2', borderRadius:4, borderWidth:1.5, borderColor:'#AABBCC', alignItems:'center', justifyContent:'center' }}>
            {/* Giant round monocle lens */}
            <View style={{ width:16, height:16, borderRadius:8, borderWidth:2.5, borderColor:'#00CCDD', backgroundColor:'rgba(0,200,220,0.12)', alignItems:'center', justifyContent:'center' }}>
              <View style={{ width:8, height:8, borderRadius:4, backgroundColor:'rgba(0,180,200,0.3)' }} />
              <View style={{ position:'absolute', top:2, left:2, width:3, height:3, borderRadius:2, backgroundColor:'rgba(255,255,255,0.6)' }} />
            </View>
            {/* Antenna with lab sample */}
            <View style={{ position:'absolute', top:-10, right:4, width:3, height:10, backgroundColor:'#AABBCC', borderRadius:1 }}>
              <View style={{ position:'absolute', top:-5, left:-3, width:9, height:6, borderRadius:3, backgroundColor:'#00CCDD', opacity:0.8 }} />
            </View>
          </View>
          {/* Neck */}
          <View style={{ width:10, height:5, backgroundColor:'#D0D8E0', borderRadius:2 }} />
          {/* Body — white lab coat style */}
          <View style={{ width:36, height:26, backgroundColor:'#EEF2F5', borderRadius:3, borderWidth:1.5, borderColor:'#AABBCC', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <View style={{ position:'absolute', left:-4, top:5, width:8, height:8, borderRadius:4, backgroundColor:'#CCDDEE' }} />
            <View style={{ position:'absolute', right:-4, top:5, width:8, height:8, borderRadius:4, backgroundColor:'#CCDDEE' }} />
            {/* Lab coat lapels */}
            <View style={{ position:'absolute', top:0, left:8, width:6, height:16, backgroundColor:'#FFFFFF', borderRadius:2 }} />
            <View style={{ position:'absolute', top:0, right:8, width:6, height:16, backgroundColor:'#FFFFFF', borderRadius:2 }} />
            {/* Pocket */}
            <View style={{ width:10, height:8, backgroundColor:'#DDE8EE', borderRadius:1, borderWidth:1, borderColor:'#AABBCC' }}>
              <View style={{ position:'absolute', top:2, left:2, width:2, height:4, backgroundColor:'#00CCDD', borderRadius:1 }} />
              <View style={{ position:'absolute', top:2, left:5, width:2, height:3, backgroundColor:'#FF4466', borderRadius:1 }} />
            </View>
          </View>
          {/* Arm (animated, holds test tube) */}
          <Animated.View style={{ position:'absolute', right:-8, top:31, transform:[{rotate:armDeg}] }}>
            <View style={{ width:8, height:20, backgroundColor:'#CCDDEE', borderRadius:3, borderWidth:1, borderColor:'#AABBCC' }}>
              <View style={{ width:10, height:6, backgroundColor:'#BBCCDD', borderRadius:2 }} />
            </View>
            {/* Test tube in hand */}
            <Animated.View style={{ position:'absolute', bottom:-BOX_H, right:-4, opacity:boxOpacity }}>
              <View style={{ width:8, height:BOX_H+4, backgroundColor:'#88DDEE', borderRadius:4, borderWidth:1, borderColor:'#00CCDD', opacity:0.85 }}>
                <View style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', backgroundColor:'#00CCDD', borderRadius:4, opacity:0.6 }} />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{ position:'absolute', left:-8, top:31, width:8, height:20, backgroundColor:'#CCDDEE', borderRadius:3, borderWidth:1, borderColor:'#AABBCC' }}>
            <View style={{ width:10, height:6, backgroundColor:'#BBCCDD', borderRadius:2 }} />
          </View>
          {/* Waist */}
          <View style={{ width:32, height:4, backgroundColor:'#CCDDEE', borderRadius:2, marginTop:1 }} />
          {/* Legs */}
          <View style={{ flexDirection:'row', gap:5, marginTop:1 }}>
            {[leftLegRot, rightLegRot].map((rot,i) => (
              <Animated.View key={i} style={{ width:12, height:16, backgroundColor:'#DDE8EE', borderRadius:3, borderWidth:1, borderColor:'#AABBCC', transform:[{rotate:rot}] }}>
                <View style={{ position:'absolute', bottom:-4, left:-2, width:16, height:6, backgroundColor:'#CCDDEE', borderRadius:3 }} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  }

  // ── World 3: BUSSE ALIEN-ROBOT ────────────────────────────────────────────────
  if (worldId === 3) {
    const antennaBob = posX.interpolate({ inputRange:[0,31,62], outputRange:['-8deg','8deg','-8deg'], extrapolate:'clamp' })
    return (
      <Animated.View style={{ transform:[{ translateX:posX }] }}>
        <View style={{ alignItems:'center', transform:[{ scaleX }] }}>
          <Animated.View style={{ alignItems:'center', transform:[{ rotate:antennaBob }] }}>
            <View style={{ width:3, height:10, backgroundColor:'#00CCAA', borderRadius:2 }} />
            <View style={{ width:8, height:8, borderRadius:4, backgroundColor:'#00FFCC' }} />
          </Animated.View>
          <View style={{ width:34, height:28, backgroundColor:'#1A3A2A', borderRadius:17, borderWidth:1.5, borderColor:'#00AA88', marginTop:-4, alignItems:'center', justifyContent:'center' }}>
            <View style={{ flexDirection:'row', gap:4 }}>
              {[0,1].map(i => (
                <View key={i} style={{ width:12, height:10, borderRadius:6, backgroundColor:'#000', borderWidth:1.5, borderColor:'#00FFCC' }}>
                  <View style={{ position:'absolute', top:1, left:1, width:4, height:4, borderRadius:2, backgroundColor:'#00FFCC', opacity:0.7 }} />
                  {i===0 && <View style={{ position:'absolute', top:1, right:1, width:2, height:2, borderRadius:1, backgroundColor:'#FFF', opacity:0.5 }} />}
                </View>
              ))}
            </View>
            <View style={{ width:14, height:2, backgroundColor:'#00AA88', borderRadius:1, marginTop:4 }} />
            <View style={{ position:'absolute', top:4, left:6, right:6, height:2, backgroundColor:'#00FFAA', opacity:0.4, borderRadius:1 }} />
          </View>
          <View style={{ width:8, height:6, backgroundColor:'#1A3A2A', borderRadius:2 }} />
          <View style={{ width:30, height:22, backgroundColor:'#0D2A1A', borderRadius:4, borderWidth:1, borderColor:'#00AA88', alignItems:'center', justifyContent:'center' }}>
            <View style={{ position:'absolute', top:4, left:4, right:4, height:1.5, backgroundColor:'#00FFAA', opacity:0.5, borderRadius:1 }} />
            <View style={{ position:'absolute', top:10, left:4, right:4, height:1.5, backgroundColor:'#00CCFF', opacity:0.4, borderRadius:1 }} />
            <View style={{ width:12, height:10, backgroundColor:'#0A1A10', borderRadius:3, borderWidth:1, borderColor:'#00FFAA' }} />
          </View>
          <Animated.View style={{ position:'absolute', right:-7, top:38, transform:[{ rotate:armDeg }] }}>
            <View style={{ width:7, height:20, backgroundColor:'#1A3A2A', borderRadius:3, borderWidth:1, borderColor:'#00AA88' }}>
              <View style={{ width:9, height:6, backgroundColor:'#0D2A1A', borderRadius:2 }} />
            </View>
            {/* Asteroid */}
            <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2-2, opacity:boxOpacity }}>
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#5A5A6A', borderRadius:5, borderWidth:1, borderColor:'#8888AA', transform:[{rotate:'15deg'}] }}>
                <View style={{ position:'absolute', top:2, left:2, width:4, height:3, borderRadius:2, backgroundColor:'#3A3A4A' }} />
                <View style={{ position:'absolute', top:5, right:2, width:3, height:3, borderRadius:2, backgroundColor:'#3A3A4A' }} />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{ position:'absolute', left:-7, top:38, width:7, height:20, backgroundColor:'#1A3A2A', borderRadius:3, borderWidth:1, borderColor:'#00AA88' }} />
          <View style={{ flexDirection:'row', gap:8, marginTop:1 }}>
            {[leftLegRot, rightLegRot].map((rot,i) => (
              <Animated.View key={i} style={{ width:8, height:16, backgroundColor:'#1A3A2A', borderRadius:4, transform:[{ rotate:rot }] }}>
                <View style={{ position:'absolute', bottom:-4, left:-3, width:14, height:6, backgroundColor:'#0D2A1A', borderRadius:3, borderWidth:1, borderColor:'#00AA88' }} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  }

  // ── World 7: BUSSE MAGMA-ROBOT ────────────────────────────────────────────────
  if (worldId === 7) {
    return (
      <Animated.View style={{ transform:[{ translateX:posX }] }}>
        <View style={{ alignItems:'center', transform:[{ scaleX }] }}>
          <View style={{ width:30, height:22, backgroundColor:'#111', borderRadius:4, borderWidth:2, borderColor:'#2A2A2A', alignItems:'center', justifyContent:'center' }}>
            <Animated.View style={{ flexDirection:'row', gap:6, opacity:lavaGlow }}>
              <View style={{ width:10, height:6, backgroundColor:'#FF3300', borderRadius:3 }} />
              <View style={{ width:10, height:6, backgroundColor:'#FF3300', borderRadius:3 }} />
            </Animated.View>
            <Animated.View style={{ position:'absolute', bottom:4, left:6, right:6, height:2, backgroundColor:'#FF5500', opacity:lavaGlow, borderRadius:1 }} />
          </View>
          <View style={{ width:12, height:5, backgroundColor:'#111', borderRadius:1 }}>
            <Animated.View style={{ position:'absolute', top:1, left:1, right:1, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
          </View>
          <View style={{ width:42, height:28, backgroundColor:'#111', borderRadius:3, borderWidth:2, borderColor:'#2A2A2A', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <View style={{ position:'absolute', left:-4, top:5, width:8, height:8, borderRadius:4, backgroundColor:'#222' }} />
            <View style={{ position:'absolute', right:-4, top:5, width:8, height:8, borderRadius:4, backgroundColor:'#222' }} />
            <Animated.View style={{ position:'absolute', top:5, left:4, width:22, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
            <Animated.View style={{ position:'absolute', top:13, right:6, width:16, height:2, backgroundColor:'#FF6600', opacity:lavaGlow, borderRadius:1 }} />
            <Animated.View style={{ position:'absolute', bottom:5, left:8, right:8, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
            <Animated.View style={{ width:18, height:14, borderRadius:3, borderWidth:1.5, borderColor:'#FF4400', backgroundColor:'#2A0800', opacity:lavaGlow }} />
          </View>
          <View style={{ position:'absolute', left:-10, top:34, width:10, height:22, backgroundColor:'#111', borderRadius:3, borderWidth:1, borderColor:'#2A2A2A' }}>
            <Animated.View style={{ position:'absolute', top:7, left:1, right:1, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
          </View>
          <Animated.View style={{ position:'absolute', right:-10, top:31, transform:[{ rotate:armDeg }] }}>
            <View style={{ width:10, height:22, backgroundColor:'#111', borderRadius:3, borderWidth:1, borderColor:'#333' }}>
              <Animated.View style={{ position:'absolute', top:7, left:1, right:1, height:2, backgroundColor:'#FF6600', opacity:lavaGlow, borderRadius:1 }} />
            </View>
            {/* Magma stone */}
            <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2-2, opacity:boxOpacity }}>
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#2A0800', borderRadius:4, borderWidth:1.5, borderColor:'#FF4400', transform:[{rotate:'-8deg'}] }}>
                <Animated.View style={{ position:'absolute', top:2, left:2, width:5, height:2, backgroundColor:'#FF5500', opacity:lavaGlow, borderRadius:1 }} />
                <Animated.View style={{ position:'absolute', bottom:2, right:2, width:4, height:2, backgroundColor:'#FF3300', opacity:lavaGlow, borderRadius:1 }} />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{ width:36, height:5, backgroundColor:'#1A1A1A', borderRadius:2, marginTop:1 }}>
            <Animated.View style={{ position:'absolute', top:1, left:4, right:4, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
          </View>
          <View style={{ flexDirection:'row', gap:6, marginTop:1 }}>
            {[leftLegRot, rightLegRot].map((rot,i) => (
              <Animated.View key={i} style={{ width:14, height:18, backgroundColor:'#111', borderRadius:3, borderWidth:1.5, borderColor:'#2A2A2A', transform:[{ rotate:rot }] }}>
                <Animated.View style={{ position:'absolute', top:6, left:2, right:2, height:2, backgroundColor:'#FF4400', opacity:lavaGlow, borderRadius:1 }} />
                <View style={{ position:'absolute', bottom:-5, left:-2, width:18, height:7, backgroundColor:'#222', borderRadius:2 }}>
                  <Animated.View style={{ position:'absolute', top:2, left:3, right:3, height:2, backgroundColor:'#FF3300', opacity:lavaGlow, borderRadius:1 }} />
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  }

  // ── World 8: BUSSE MUMMY-ROBOT ────────────────────────────────────────────────
  if (worldId === 8) {
    return (
      <Animated.View style={{ transform:[{ translateX:posX }] }}>
        <View style={{ alignItems:'center', transform:[{ scaleX }] }}>
          <View style={{ width:28, height:22, backgroundColor:'#8B6914', borderRadius:3, alignItems:'center', justifyContent:'center' }}>
            <View style={{ flexDirection:'row', gap:5, marginBottom:2 }}>
              {[0,1].map(i => (
                <View key={i} style={{ width:9, height:9, borderRadius:5, backgroundColor:'#FFB800', borderWidth:1, borderColor:'#AA7700' }}>
                  <View style={{ position:'absolute', top:2, left:2, width:5, height:5, borderRadius:3, backgroundColor:'#3A2000' }} />
                </View>
              ))}
            </View>
            <View style={{ position:'absolute', top:3,  left:-2, right:-2, height:4, backgroundColor:'#E8DDCC', borderRadius:2, opacity:0.85 }} />
            <View style={{ position:'absolute', top:14, left:-3, right:-1, height:4, backgroundColor:'#DDCCBB', borderRadius:2, opacity:0.9, transform:[{rotate:'3deg'}] }} />
            <View style={{ position:'absolute', bottom:1, left:2, right:-2, height:3, backgroundColor:'#E8DDCC', borderRadius:1, opacity:0.8 }} />
          </View>
          <View style={{ width:10, height:5, backgroundColor:'#7A5A14', borderRadius:2 }}>
            <View style={{ position:'absolute', top:1, left:0, right:0, height:3, backgroundColor:'#E8DDCC', opacity:0.8, borderRadius:1 }} />
          </View>
          <View style={{ width:36, height:26, backgroundColor:'#7A5A14', borderRadius:3, alignItems:'center', justifyContent:'center', position:'relative' }}>
            <View style={{ width:14, height:16, backgroundColor:'#5A4008', borderRadius:2, borderWidth:1, borderColor:'#C4A000', alignItems:'center', gap:2, paddingTop:2 }}>
              {[0,1,2].map(i => <View key={i} style={{ width:8-i*2, height:2, backgroundColor:'#C4A000', borderRadius:1, opacity:0.7 }} />)}
            </View>
            <View style={{ position:'absolute', top:3, left:-3, right:-1, height:4, backgroundColor:'#DDCCBB', opacity:0.75, borderRadius:1, transform:[{rotate:'-2deg'}] }} />
            <View style={{ position:'absolute', top:12, left:-1, right:-3, height:4, backgroundColor:'#E8DDCC', opacity:0.7, borderRadius:1, transform:[{rotate:'3deg'}] }} />
            <View style={{ position:'absolute', bottom:3, left:-2, right:0, height:4, backgroundColor:'#DDCCBB', opacity:0.8, borderRadius:1, transform:[{rotate:'-1deg'}] }} />
          </View>
          <Animated.View style={{ position:'absolute', right:-8, top:33, transform:[{ rotate:armDeg }] }}>
            <View style={{ width:9, height:21, backgroundColor:'#7A5A14', borderRadius:3 }}>
              <View style={{ position:'absolute', top:4, left:-1, right:-1, height:3, backgroundColor:'#E8DDCC', opacity:0.7, borderRadius:1, transform:[{rotate:'5deg'}] }} />
              <View style={{ position:'absolute', bottom:2, width:11, height:6, backgroundColor:'#5A4008', borderRadius:2 }} />
            </View>
            <View style={{ position:'absolute', bottom:-8, right:0, width:4, height:10, backgroundColor:'#E8DDCC', opacity:0.6, borderRadius:2, transform:[{rotate:'15deg'}] }} />
            {/* Treasure chest */}
            <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2-2, opacity:boxOpacity }}>
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#5A3A08', borderRadius:2, borderWidth:1.5, borderColor:'#C4A000' }}>
                <View style={{ position:'absolute', top:0, left:0, right:0, height:3, backgroundColor:'#C4A000' }} />
                <View style={{ position:'absolute', top:5, left:2, width:4, height:4, borderRadius:2, backgroundColor:'#FFD700' }} />
                <View style={{ position:'absolute', top:5, left:8, width:3, height:3, borderRadius:2, backgroundColor:'#FF4444' }} />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{ position:'absolute', left:-8, top:33, width:9, height:21, backgroundColor:'#7A5A14', borderRadius:3 }}>
            <View style={{ position:'absolute', top:6, left:-1, right:-1, height:3, backgroundColor:'#E8DDCC', opacity:0.7, borderRadius:1, transform:[{rotate:'-4deg'}] }} />
          </View>
          <View style={{ width:32, height:5, backgroundColor:'#6A4A10', borderRadius:2, marginTop:1 }} />
          <View style={{ flexDirection:'row', gap:5, marginTop:1 }}>
            {[leftLegRot, rightLegRot].map((rot,i) => (
              <Animated.View key={i} style={{ width:12, height:16, backgroundColor:'#7A5A14', borderRadius:3, transform:[{ rotate:rot }] }}>
                <View style={{ position:'absolute', top:4, left:-1, right:-1, height:3, backgroundColor:'#E8DDCC', opacity:0.65, borderRadius:1 }} />
                <View style={{ position:'absolute', bottom:-4, left:-2, width:16, height:6, backgroundColor:'#5A4008', borderRadius:2 }} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    )
  }

  // ── World 9: BUSSE CYBER-AI ─────────────────────────────────────────────────
  if (worldId === 9) {
    const neonPulse = useRef(new Animated.Value(0.4)).current
    useEffect(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(neonPulse, { toValue:1,   duration:600, useNativeDriver:false }),
        Animated.timing(neonPulse, { toValue:0.4, duration:600, useNativeDriver:false }),
      ])).start()
    }, [])
    return (
      <Animated.View style={{ transform:[{translateX:posX}] }}>
        <View style={{ alignItems:'center', transform:[{scaleX}] }}>
          {/* Neural antenna array */}
          <View style={{ flexDirection:'row', gap:5, marginBottom:2 }}>
            {[10,14,10].map((h,i)=>(
              <Animated.View key={i} style={{ width:2, height:h, backgroundColor:'#FF00CC', borderRadius:1, opacity:neonPulse }} />
            ))}
          </View>
          {/* Sleek angular head */}
          <View style={{ width:30, height:20, backgroundColor:'#0A0A14', borderRadius:3, borderWidth:1.5, borderColor:'#FF00CC', alignItems:'center', justifyContent:'center' }}>
            {/* LED eye strip — 5 eyes in a line */}
            <Animated.View style={{ flexDirection:'row', gap:3, opacity:neonPulse }}>
              {[0,1,2,3,4].map(i=>(
                <View key={i} style={{ width:4, height:4, borderRadius:2,
                  backgroundColor: i===2 ? '#FFFFFF' : i%2===0 ? '#FF00CC' : '#00FFFF' }} />
              ))}
            </Animated.View>
            {/* Thin speaker grill at bottom */}
            <View style={{ flexDirection:'row', gap:2, marginTop:3 }}>
              {[0,1,2,3].map(i=><View key={i} style={{ width:4, height:1.5, backgroundColor:'#FF00CC', opacity:0.5 }} />)}
            </View>
            {/* Side neon trim */}
            <Animated.View style={{ position:'absolute', left:0, top:4, bottom:4, width:2, backgroundColor:'#FF00CC', opacity:neonPulse }} />
            <Animated.View style={{ position:'absolute', right:0, top:4, bottom:4, width:2, backgroundColor:'#00FFFF', opacity:neonPulse }} />
          </View>
          {/* Neck */}
          <View style={{ width:12, height:4, backgroundColor:'#0A0A14', borderWidth:1, borderColor:'#FF00CC' }} />
          {/* Sleek body with holographic chest */}
          <View style={{ width:36, height:26, backgroundColor:'#050510', borderRadius:3, borderWidth:1.5, borderColor:'#FF00CC', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <View style={{ position:'absolute', left:-4, top:4, width:8, height:8, borderRadius:4, backgroundColor:'#0A0A14', borderWidth:1.5, borderColor:'#FF00CC' }} />
            <View style={{ position:'absolute', right:-4, top:4, width:8, height:8, borderRadius:4, backgroundColor:'#0A0A14', borderWidth:1.5, borderColor:'#00FFFF' }} />
            {/* Holographic chest display */}
            <Animated.View style={{ width:20, height:14, borderRadius:2, borderWidth:1, borderColor:'#00FFFF', backgroundColor:'rgba(0,255,255,0.06)', opacity:neonPulse }}>
              {[0,1,2].map(i=><View key={i} style={{ position:'absolute', top:3+i*4, left:2, width:12-i*2, height:1.5, backgroundColor:'#00FFFF', borderRadius:1, opacity:0.7 }} />)}
            </Animated.View>
            {/* Edge neon lines */}
            <Animated.View style={{ position:'absolute', bottom:3, left:4, right:4, height:1.5, backgroundColor:'#FF00CC', opacity:neonPulse, borderRadius:1 }} />
          </View>
          {/* Arm animated */}
          <Animated.View style={{ position:'absolute', right:-9, top:30, transform:[{rotate:armDeg}] }}>
            <View style={{ width:9, height:22, backgroundColor:'#0A0A14', borderRadius:2, borderWidth:1.5, borderColor:'#FF00CC' }}>
              <Animated.View style={{ position:'absolute', top:6, left:1, right:1, height:1.5, backgroundColor:'#FF00CC', opacity:neonPulse, borderRadius:1 }} />
              <View style={{ position:'absolute', bottom:0, width:11, height:6, backgroundColor:'#050510', borderRadius:2, borderWidth:1, borderColor:'#00FFFF' }} />
            </View>
            <Animated.View style={{ position:'absolute', bottom:-BOX_H-2, right:-BOX_W/2-2, opacity:boxOpacity }}>
              {/* Mini Busse carried */}
              <View style={{ width:12, height:14, alignItems:'center' }}>
                <View style={{ width:10, height:7, backgroundColor:'#FF00CC', borderRadius:2, borderWidth:1, borderColor:'#FF88FF' }}>
                  <View style={{ position:'absolute', top:1, left:1, width:3, height:3, borderRadius:2, backgroundColor:'#00FFFF' }} />
                </View>
                <View style={{ width:8, height:5, backgroundColor:'#CC00AA', borderRadius:1 }} />
              </View>
            </Animated.View>
          </Animated.View>
          {/* Static arm */}
          <View style={{ position:'absolute', left:-9, top:30, width:9, height:22, backgroundColor:'#0A0A14', borderRadius:2, borderWidth:1.5, borderColor:'#00FFFF' }}>
            <Animated.View style={{ position:'absolute', top:6, left:1, right:1, height:1.5, backgroundColor:'#00FFFF', opacity:neonPulse, borderRadius:1 }} />
          </View>
          {/* Hover base — glowing platform instead of legs */}
          <View style={{ width:38, height:6, backgroundColor:'#0A0A14', borderRadius:3, borderWidth:1.5, borderColor:'#FF00CC', marginTop:2 }}>
            <Animated.View style={{ position:'absolute', bottom:-3, left:4, right:4, height:4, borderRadius:2, backgroundColor:'#FF00CC', opacity:neonPulse }} />
          </View>
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
          {/* World-specific cargo in right hand */}
          <Animated.View style={[styles.carryBox, { opacity: boxOpacity }]}>
            {worldId === 1 ? (
              // Light bulb
              <View style={{ alignItems:'center' }}>
                <View style={{ width:10, height:13, borderRadius:5, backgroundColor:'#FFEE88', borderWidth:1, borderColor:'#FFD700' }} />
                <View style={{ width:7, height:4, backgroundColor:'#888', borderRadius:1 }} />
              </View>
            ) : worldId === 2 ? (
              // Medicine bottle
              <View style={{ alignItems:'center' }}>
                <View style={{ width:6, height:3, backgroundColor:'#FFF', borderRadius:1 }} />
                <View style={{ width:10, height:14, borderRadius:2, backgroundColor:'rgba(0,200,220,0.8)', borderWidth:1, borderColor:'#00AACC' }} />
              </View>
            ) : worldId === 3 ? (
              // Asteroid
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#5A5A6A', borderRadius:5, borderWidth:1, borderColor:'#8888AA', transform:[{rotate:'15deg'}] }}>
                <View style={{ position:'absolute', top:2, left:2, width:4, height:3, borderRadius:2, backgroundColor:'#3A3A4A' }} />
              </View>
            ) : worldId === 4 ? (
              // Sword
              <View style={{ alignItems:'center', width:BOX_W, height:BOX_H }}>
                <View style={{ width:3, height:BOX_H, backgroundColor:'#C8C8D8', borderRadius:1 }} />
                <View style={{ position:'absolute', top:4, width:BOX_W, height:3, backgroundColor:'#8B6914', borderRadius:1 }} />
              </View>
            ) : worldId === 5 ? (
              // Dino egg
              <View style={{ width:12, height:BOX_H+2, borderRadius:6, backgroundColor:'#88BB44', borderWidth:1, borderColor:'#6A9930' }} />
            ) : worldId === 6 ? (
              // Pearl
              <View style={{ width:BOX_W, height:BOX_H, borderRadius:3, backgroundColor:'#8B8B7A', borderWidth:1, borderColor:'#AAA990', justifyContent:'center', alignItems:'center' }}>
                <View style={{ width:8, height:8, borderRadius:4, backgroundColor:'#F8F0FF', borderWidth:1, borderColor:'#DDD0EE' }} />
              </View>
            ) : worldId === 7 ? (
              // Magma stone
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#3A1A00', borderRadius:4, borderWidth:1.5, borderColor:'#FF4400', transform:[{rotate:'-8deg'}] }} />
            ) : worldId === 8 ? (
              // Treasure chest
              <View style={{ width:BOX_W, height:BOX_H, backgroundColor:'#5A3A08', borderRadius:2, borderWidth:1, borderColor:'#C4A000' }}>
                <View style={{ position:'absolute', top:0, left:0, right:0, height:3, backgroundColor:'#C4A000' }} />
                <View style={{ position:'absolute', top:5, left:3, width:4, height:4, borderRadius:2, backgroundColor:'#FFD700' }} />
              </View>
            ) : worldId === 9 ? (
              // Mini Busse
              <View style={{ alignItems:'center' }}>
                <View style={{ width:10, height:8, backgroundColor:'#FF00CC', borderRadius:2, borderWidth:1, borderColor:'#FF88FF' }}>
                  <View style={{ position:'absolute', top:1, left:1, width:3, height:3, borderRadius:2, backgroundColor:'#00FFFF' }} />
                </View>
                <View style={{ width:8, height:6, backgroundColor:'#CC00AA', borderRadius:1 }} />
              </View>
            ) : (
              // Default box (world 0)
              <>
                <View style={styles.carryBoxFront} />
                <View style={styles.carryBoxTop} />
                <View style={styles.carryBoxSide} />
              </>
            )}
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
