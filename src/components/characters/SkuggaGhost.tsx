import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions } from 'react-native'
import Svg, { Ellipse, Rect, Circle, Path, G } from 'react-native-svg'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface Props {
  visible: boolean
}

export default function SkuggaGhost({ visible }: Props) {
  const translateX = useRef(new Animated.Value(-120)).current
  const opacity = useRef(new Animated.Value(0)).current
  const bobY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      translateX.setValue(-120)
      opacity.setValue(0)
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0.85, duration: 500, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: SCREEN_WIDTH + 120, duration: 4000, useNativeDriver: true }),
      ]).start()
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobY, { toValue: -10, duration: 600, useNativeDriver: true }),
          Animated.timing(bobY, { toValue: 10, duration: 600, useNativeDriver: true }),
        ])
      ).start()
    } else {
      opacity.setValue(0)
      bobY.stopAnimation()
      bobY.setValue(0)
    }
  }, [visible])

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 40,
        left: 0,
        opacity,
        transform: [{ translateX }, { translateY: bobY }],
      }}
      pointerEvents="none"
    >
      <Svg width={80} height={100} viewBox="0 0 80 100">
        {/* Shadow */}
        <Ellipse cx="40" cy="95" rx="20" ry="5" fill="rgba(0,0,0,0.3)" />
        {/* Ghost body */}
        <Path
          d="M10,40 Q10,10 40,10 Q70,10 70,40 L70,80 Q60,72 50,80 Q40,88 30,80 Q20,72 10,80 Z"
          fill="#2A2A4A"
          opacity={0.9}
        />
        {/* Glowing eyes */}
        <Circle cx="30" cy="42" r="6" fill="#00FFFF" opacity={0.8} />
        <Circle cx="50" cy="42" r="6" fill="#00FFFF" opacity={0.8} />
        <Circle cx="30" cy="42" r="3" fill="#FFFFFF" />
        <Circle cx="50" cy="42" r="3" fill="#FFFFFF" />
        {/* Mouth */}
        <Path d="M30,56 Q40,64 50,56" stroke="#00FFFF" strokeWidth="2" fill="none" opacity={0.7} />
        {/* +10% tag */}
        <Rect x="20" y="5" width="40" height="14" fill="#00FFFF" rx="3" opacity={0.9} />
        <Rect x="21" y="6" width="38" height="12" fill="#0A0A2A" rx="2" />
      </Svg>
    </Animated.View>
  )
}
