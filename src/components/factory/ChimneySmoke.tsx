import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

interface SmokeParticle {
  y: Animated.Value
  opacity: Animated.Value
  x: number
}

function createParticle(xOffset: number): SmokeParticle {
  return {
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
    x: xOffset,
  }
}

interface Props {
  chimney1X: number
  chimney2X: number
  active?: boolean
}

export default function ChimneySmoke({ chimney1X, chimney2X, active = true }: Props) {
  const particles = useRef([
    createParticle(chimney1X),
    createParticle(chimney1X + 6),
    createParticle(chimney2X),
    createParticle(chimney2X + 6),
  ]).current

  useEffect(() => {
    if (!active) return
    const animations = particles.map((p, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * 400),
          Animated.parallel([
            Animated.timing(p.y, { toValue: -50, duration: 2000, useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(p.opacity, { toValue: 0.6, duration: 500, useNativeDriver: true }),
              Animated.timing(p.opacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(p.y, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      )
    })
    animations.forEach(a => a.start())
    return () => animations.forEach(a => a.stop())
  }, [active])

  return (
    <>
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: p.x,
            top: 0,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#888888',
            opacity: p.opacity,
            transform: [{ translateY: p.y }],
          }}
        />
      ))}
    </>
  )
}
