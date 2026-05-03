import React, { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'

// A single product box sliding along the belt
function BeltItem({ width, color, delay }: { width: number; color: string; delay: number }) {
  const posX = useRef(new Animated.Value(width + 20)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const run = () => {
      posX.setValue(width + 20)
      opacity.setValue(0)
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: false }),
          Animated.timing(posX, { toValue: -40, duration: 4000, useNativeDriver: false }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start(run)
    }
    run()
  }, [])

  return (
    <Animated.View
      style={[
        styles.item,
        { left: posX, opacity },
      ]}
    >
      {/* 3D box: front face */}
      <View style={styles.boxFront} />
      {/* 3D box: top face */}
      <View style={styles.boxTop} />
      {/* 3D box: right side */}
      <View style={styles.boxSide} />
    </Animated.View>
  )
}

interface Props {
  width: number
  color?: string
  stripeColor?: string
  active?: boolean
}

export default function ConveyorBelt({ width, color = '#444444', stripeColor = '#555555', active = true }: Props) {
  const offset = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!active) return
    Animated.loop(
      Animated.timing(offset, { toValue: -24, duration: 700, useNativeDriver: false })
    ).start()
    return () => offset.stopAnimation()
  }, [active])

  const stripes = Array.from({ length: Math.ceil(width / 24) + 3 }, (_, i) => i)

  return (
    <View style={[styles.wrapper, { width }]}>
      {/* Belt surface */}
      <View style={[styles.belt, { backgroundColor: color }]}>
        {/* Moving stripes */}
        <Animated.View style={[styles.stripeRow, { transform: [{ translateX: offset }] }]}>
          {stripes.map(i => (
            <View
              key={i}
              style={[styles.stripe, { backgroundColor: i % 2 === 0 ? stripeColor : color }]}
            />
          ))}
        </Animated.View>
        {/* Belt top edge */}
        <View style={styles.edgeTop} />
        {/* Belt bottom edge */}
        <View style={styles.edgeBottom} />
        {/* Moving items */}
        {active && (
          <>
            <BeltItem width={width} color={stripeColor} delay={0} />
            <BeltItem width={width} color={stripeColor} delay={1500} />
            <BeltItem width={width} color={stripeColor} delay={3000} />
          </>
        )}
      </View>
      {/* 3D depth — front face of belt frame */}
      <View style={[styles.beltDepth, { backgroundColor: '#222', width }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
  },
  belt: {
    height: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  stripeRow: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  stripe: {
    width: 24,
    height: '100%',
  },
  edgeTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  edgeBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  // Belt item: 3D product box
  item: {
    position: 'absolute',
    top: 1,
    width: 20,
    height: 16,
  },
  boxFront: {
    position: 'absolute',
    bottom: 0, left: 0,
    width: 16, height: 13,
    backgroundColor: '#7B4A08',
    borderWidth: 1,
    borderColor: '#C4A000',
    borderRadius: 1,
  },
  boxTop: {
    position: 'absolute',
    bottom: 13, left: 3,
    width: 16, height: 5,
    backgroundColor: '#9B6010',
    borderWidth: 1,
    borderColor: '#C4A000',
    transform: [{ skewX: '30deg' }],
  },
  boxSide: {
    position: 'absolute',
    bottom: 1, left: 16,
    width: 4, height: 11,
    backgroundColor: '#4A2A04',
    borderWidth: 1,
    borderColor: '#7B5000',
    transform: [{ skewY: '-30deg' }],
  },
  beltDepth: {
    height: 5,
    backgroundColor: '#222',
  },
})
