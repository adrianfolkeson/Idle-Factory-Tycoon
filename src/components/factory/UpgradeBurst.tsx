import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import PixelIcon from '../ui/PixelIcon'

const ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

function Coin({ angle, color }: { angle: number; color: string }) {
  const d  = useRef(new Animated.Value(0)).current
  const op = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.parallel([
      Animated.timing(d,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(op, { toValue:0, duration:300, useNativeDriver:true }),
      ]),
    ]).start()
  }, [])
  const r  = 55
  const tx = d.interpolate({ inputRange:[0,1], outputRange:[0, Math.cos(angle)*r] })
  const ty = d.interpolate({ inputRange:[0,1], outputRange:[0, Math.sin(angle)*r] })
  return (
    <Animated.View style={{ position:'absolute', opacity:op, transform:[{translateX:tx},{translateY:ty}] }}>
      <PixelIcon name="coin" size={14} color={color} />
    </Animated.View>
  )
}

interface Instance { id: number; color: string }

export interface UpgradeBurstRef { trigger: (color: string) => void }

const UpgradeBurst = forwardRef<UpgradeBurstRef>((_, ref) => {
  const [list, setList] = useState<Instance[]>([])
  const next = useRef(0)
  useImperativeHandle(ref, () => ({
    trigger: (color: string) => {
      const id = next.current++
      setList(p => [...p, { id, color }])
      setTimeout(() => setList(p => p.filter(b => b.id !== id)), 600)
    },
  }))
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {list.map(b => (
        <View key={b.id} style={styles.center}>
          {ANGLES.map((a,i) => <Coin key={i} angle={a} color={b.color} />)}
        </View>
      ))}
    </View>
  )
})

export default UpgradeBurst

const styles = StyleSheet.create({
  center: { position:'absolute', top:'50%', left:'50%', zIndex:10 },
})
