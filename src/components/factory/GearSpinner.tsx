import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import Svg, { Circle, Rect, G } from 'react-native-svg'

interface Props {
  size?: number
  color?: string
  speed?: number
  counterClockwise?: boolean
}

export default function GearSpinner({ size = 28, color = '#666666', speed = 2400, counterClockwise = false }: Props) {
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: counterClockwise ? -1 : 1,
        duration: speed,
        useNativeDriver: false,
      })
    ).start()
  }, [])

  const rotate = rotation.interpolate({
    inputRange: [counterClockwise ? -1 : 0, counterClockwise ? 0 : 1],
    outputRange: counterClockwise ? ['360deg', '0deg'] : ['0deg', '360deg'],
  })

  const r = size / 2
  const innerR = r * 0.35
  const teethCount = 8
  const teethW = size * 0.13
  const teethH = size * 0.22

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Gear body */}
        <Circle cx={r} cy={r} r={r * 0.58} fill={color} />
        {/* Teeth */}
        {Array.from({ length: teethCount }, (_, i) => {
          const angle = (i * 360) / teethCount
          return (
            <G key={i} origin={`${r}, ${r}`} rotation={angle}>
              <Rect
                x={r - teethW / 2}
                y={r * 0.1}
                width={teethW}
                height={teethH}
                fill={color}
                rx={2}
              />
            </G>
          )
        })}
        {/* Center hub */}
        <Circle cx={r} cy={r} r={innerR} fill="#222222" />
        <Circle cx={r} cy={r} r={innerR * 0.5} fill="#333333" />
      </Svg>
    </Animated.View>
  )
}
