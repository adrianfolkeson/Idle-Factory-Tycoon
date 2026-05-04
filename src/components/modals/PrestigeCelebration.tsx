import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import PixelIcon from '../ui/PixelIcon'
import { COLORS } from '../../constants/colors'

const { width: SW, height: SH } = Dimensions.get('window')
const BURST = Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2)
const PAL   = ['#FF00CC','#00FFFF','#FFD700','#FF4400','#00FF88','#FF00FF','#FFFF00','#4488FF','#FF8800']

function Particle({ angle, delay }: { angle: number; delay: number }) {
  const d  = useRef(new Animated.Value(0)).current
  const op = useRef(new Animated.Value(0)).current
  const color = PAL[Math.floor(Math.abs(Math.cos(angle) * 9)) % PAL.length]
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(d,  { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(op, { toValue: 1,   duration: 200, useNativeDriver: true }),
          Animated.delay(500),
          Animated.timing(op, { toValue: 0,   duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]).start()
  }, [])
  const r  = 160
  const tx = d.interpolate({ inputRange:[0,1], outputRange:[0, Math.cos(angle)*r] })
  const ty = d.interpolate({ inputRange:[0,1], outputRange:[0, Math.sin(angle)*r] })
  return (
    <Animated.View style={{ position:'absolute', width:10, height:10, borderRadius:5,
      backgroundColor:color, opacity:op, transform:[{translateX:tx},{translateY:ty}] }} />
  )
}

interface Props { visible: boolean; newPrestige: number; multiplier: number }

export default function PrestigeCelebration({ visible, newPrestige, multiplier }: Props) {
  const bg     = useRef(new Animated.Value(0)).current
  const scale  = useRef(new Animated.Value(0)).current
  const titleOp = useRef(new Animated.Value(0)).current
  const subOp  = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) return
    bg.setValue(0); scale.setValue(0); titleOp.setValue(0); subOp.setValue(0)
    Animated.sequence([
      Animated.timing(bg, { toValue:1, duration:200, useNativeDriver:true }),
      Animated.parallel([
        Animated.spring(scale, { toValue:1, friction:5, tension:120, useNativeDriver:true }),
        Animated.timing(titleOp, { toValue:1, duration:400, useNativeDriver:true }),
      ]),
      Animated.delay(150),
      Animated.timing(subOp, { toValue:1, duration:400, useNativeDriver:true }),
    ]).start()
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[styles.overlay, { opacity:bg }]} pointerEvents="none">
      <View style={styles.particleCenter}>
        {BURST.map((a,i) => <Particle key={i} angle={a} delay={i*18} />)}
      </View>
      <Animated.View style={[styles.content, { transform:[{scale}] }]}>
        <Animated.View style={{ opacity:scale }}>
          <PixelIcon name="crown" size={52} color={COLORS.gold} />
        </Animated.View>
        <Animated.Text style={[styles.title, { opacity:titleOp }]}>PRESTIGE!</Animated.Text>
        <Animated.View style={[styles.badge, { opacity:subOp }]}>
          <Text style={styles.bonusNum}>+{Math.round((multiplier-1)*100)}%</Text>
          <Text style={styles.bonusSub}>PERMANENT PRODUKTIONSBONUS</Text>
        </Animated.View>
        <Animated.Text style={[styles.count, { opacity:subOp }]}>
          Prestige #{newPrestige} — du är legendarisk
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleCenter: {
    position: 'absolute',
    top: '50%', left: '50%',
    width:0, height:0,
    alignItems:'center', justifyContent:'center',
  },
  content: { alignItems:'center', gap:18 },
  title: {
    fontSize: 56,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 4,
    textShadowColor: COLORS.gold,
    textShadowOffset: { width:0, height:0 },
    textShadowRadius: 24,
  },
  badge: {
    alignItems:'center',
    backgroundColor:'#1A1400',
    borderWidth:2, borderColor:COLORS.gold,
    borderRadius:10,
    paddingVertical:14, paddingHorizontal:32,
  },
  bonusNum: {
    fontSize:42,
    fontFamily:'Courier New',
    fontWeight:'bold',
    color:COLORS.gold,
  },
  bonusSub: {
    fontSize:11,
    fontFamily:'Courier New',
    color:COLORS.offWhite,
    letterSpacing:1,
    marginTop:4,
  },
  count: {
    fontSize:13,
    fontFamily:'Courier New',
    color:COLORS.grey,
    letterSpacing:1,
  },
})
