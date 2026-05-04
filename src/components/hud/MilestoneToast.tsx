import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { COLORS } from '../../constants/colors'
import PixelIcon from '../ui/PixelIcon'
import { formatRate } from '../../lib/formatting'

const MILESTONES = [1, 10, 100, 1000, 10000, 1e5, 1e6, 1e9, 1e12]

export default function MilestoneToast({ rate }: { rate: number }) {
  const shown   = useRef(new Set<number>())
  const [cur, setCur] = useState<number|null>(null)
  const slideY  = useRef(new Animated.Value(-90)).current
  const op      = useRef(new Animated.Value(0)).current

  useEffect(() => {
    for (const m of MILESTONES) {
      if (rate >= m && !shown.current.has(m)) {
        shown.current.add(m)
        setCur(m)
        slideY.setValue(-90); op.setValue(0)
        Animated.sequence([
          Animated.parallel([
            Animated.timing(slideY, { toValue:0,   duration:350, useNativeDriver:true }),
            Animated.timing(op,     { toValue:1,   duration:350, useNativeDriver:true }),
          ]),
          Animated.delay(2600),
          Animated.parallel([
            Animated.timing(slideY, { toValue:-90, duration:300, useNativeDriver:true }),
            Animated.timing(op,     { toValue:0,   duration:300, useNativeDriver:true }),
          ]),
        ]).start(() => setCur(null))
        break
      }
    }
  }, [Math.floor(rate)])

  if (cur === null) return null

  return (
    <Animated.View pointerEvents="none"
      style={[styles.toast, { opacity:op, transform:[{translateY:slideY}] }]}>
      <PixelIcon name="gear" size={18} color={COLORS.greenLight} />
      <View>
        <Text style={styles.label}>PRODUKTIONSMILSTOLPE!</Text>
        <Text style={styles.value}>+{formatRate(cur)} nådd</Text>
      </View>
      <View style={styles.spark}>
        <PixelIcon name="star" size={12} color={COLORS.gold} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position:'absolute', top:0, left:12, right:12,
    flexDirection:'row', alignItems:'center', gap:12,
    backgroundColor:'#061A08',
    borderWidth:2, borderColor:COLORS.greenLight,
    borderRadius:8, padding:12,
    zIndex:998,
    shadowColor:COLORS.greenLight, shadowOpacity:0.6, shadowRadius:12,
  },
  label: { fontSize:9, fontFamily:'Courier New', color:COLORS.greenLight, letterSpacing:2, fontWeight:'bold' },
  value: { fontSize:18, fontFamily:'Courier New', fontWeight:'bold', color:COLORS.white },
  spark: { marginLeft:'auto' },
})
