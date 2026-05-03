import React, { useEffect, useRef } from 'react'
import { Animated, View, Text, StyleSheet } from 'react-native'
import { ACHIEVEMENTS } from '../../constants/achievements'
import { COLORS } from '../../constants/colors'
import PixelIcon from '../ui/PixelIcon'

interface Props {
  achievementId: string | null
}

export default function AchievementToast({ achievementId }: Props) {
  const translateY = useRef(new Animated.Value(-80)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!achievementId) return
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(2200),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -80, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start()
  }, [achievementId])

  if (!achievementId) return null
  const ach = ACHIEVEMENTS.find(a => a.id === achievementId)
  if (!ach) return null

  return (
    <Animated.View
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <PixelIcon name={ach.icon} size={28} color={COLORS.gold} />
      <View>
        <Text style={styles.title}>ACHIEVEMENT!</Text>
        <Text style={styles.name}>{ach.name}</Text>
        <Text style={styles.desc}>{ach.description}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: '#1A1A00',
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 999,
  },
  title: {
    fontSize: 9,
    fontFamily: 'Courier New',
    color: COLORS.gold,
    letterSpacing: 2,
    marginBottom: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  desc: {
    fontSize: 10,
    fontFamily: 'Courier New',
    color: COLORS.grey,
  },
})
