import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { COLORS } from '../constants/colors'
import PixelIcon from './ui/PixelIcon'

const { width: SW } = Dimensions.get('window')

export default function LoadingScreen() {
  const gearRot  = useRef(new Animated.Value(0)).current
  const titleOp  = useRef(new Animated.Value(0)).current
  const dotScale = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    // Spinning gear
    Animated.loop(
      Animated.timing(gearRot, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start()
    // Fade in title
    Animated.timing(titleOp, { toValue: 1, duration: 600, useNativeDriver: true }).start()
    // Pulsing dot
    Animated.loop(Animated.sequence([
      Animated.timing(dotScale, { toValue: 1.2, duration: 600, useNativeDriver: true }),
      Animated.timing(dotScale, { toValue: 0.8, duration: 600, useNativeDriver: true }),
    ])).start()
  }, [])

  const rotate = gearRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: titleOp, alignItems: 'center', gap: 24 }}>
        {/* Spinning gear icon */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <PixelIcon name="gear" size={64} color={COLORS.gold} />
        </Animated.View>

        {/* Game title */}
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={styles.title}>IDLE FACTORY</Text>
          <Text style={styles.subtitle}>TYCOON</Text>
        </View>

        {/* Loading dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map(i => (
            <Animated.View key={i} style={[
              styles.dot,
              { transform: [{ scale: i === 1 ? dotScale : 1 }] },
              { opacity: i === 1 ? dotScale : 0.5 },
            ]} />
          ))}
        </View>
      </Animated.View>

      <Text style={styles.tagline}>av Bosse & BUSSE</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 4,
    textShadowColor: COLORS.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.greyDark,
    letterSpacing: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  tagline: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    fontFamily: 'Courier New',
    color: COLORS.greyDark,
    letterSpacing: 2,
  },
})
