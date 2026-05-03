import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, Text, StyleSheet, View } from 'react-native'
import { formatMoney } from '../../lib/formatting'
import { COLORS } from '../../constants/colors'

interface FloatItem {
  id: number
  x: number
  y: number
  amount: number
}

interface Props {
  containerStyle?: object
}

let nextId = 0

export function useFloatingDollars() {
  const [items, setItems] = useState<FloatItem[]>([])

  const spawn = useCallback((x: number, y: number, amount: number) => {
    const id = nextId++
    setItems(prev => [...prev.slice(-8), { id, x, y, amount }])
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id))
    }, 900)
  }, [])

  return { items, spawn }
}

function FloatBubble({ item }: { item: FloatItem }) {
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -60, duration: 800, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start()
  }, [])

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.bubble, { left: item.x - 30, top: item.y - 20, opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.text}>+{formatMoney(item.amount)}</Text>
    </Animated.View>
  )
}

export default function FloatingDollars({ items }: { items: FloatItem[] }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {items.map(item => (
        <FloatBubble key={item.id} item={item} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  text: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
  },
})
