import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from '../../constants/colors'
import PixelIcon from '../ui/PixelIcon'

const { width: SW, height: SH } = Dimensions.get('window')
const KEY = 'onboarding_done'

interface Step {
  icon: string
  title: string
  body: string
  arrowBottom?: boolean  // show arrow pointing down toward tap button
  arrowTab?: boolean     // show arrow pointing to tab bar
}

const STEPS: Step[] = [
  {
    icon: 'hand',
    title: 'Välkommen till Bossens Fabrik!',
    body: 'Tryck på KLICKA-knappen längst ner för att tjäna dina första pengar.',
    arrowBottom: true,
  },
  {
    icon: 'gear',
    title: 'Köp din första uppgradering!',
    body: 'Gå till Uppgradera-fliken och köp "Gammal Verkstad" för att starta automatisk produktion.',
    arrowTab: true,
  },
  {
    icon: 'trophy',
    title: 'Samla alla världar!',
    body: 'Tjäna mer pengar för att låsa upp nya, vildare fabriker — från vikingatiden till rymden!',
  },
]

export default function OnboardingOverlay() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const opacity = useRef(new Animated.Value(0)).current
  const arrowBounce = useRef(new Animated.Value(0)).current

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(done => {
      if (!done) setVisible(true)
    })
  }, [])

  useEffect(() => {
    if (!visible) return
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start()
    Animated.loop(Animated.sequence([
      Animated.timing(arrowBounce, { toValue: 10, duration: 500, useNativeDriver: true }),
      Animated.timing(arrowBounce, { toValue: 0,  duration: 500, useNativeDriver: true }),
    ])).start()
  }, [visible])

  const dismiss = async () => {
    await AsyncStorage.setItem(KEY, 'true')
    Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setVisible(false))
  }

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      await dismiss()
    }
  }

  if (!visible) return null

  const current = STEPS[step]

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="box-none">
      {/* Dark mask */}
      <View style={styles.mask} />

      {/* Bottom arrow */}
      {current.arrowBottom && (
        <Animated.View style={[styles.arrowWrap, styles.arrowBottom, { transform: [{ translateY: arrowBounce }] }]}>
          <View style={styles.arrowDown} />
        </Animated.View>
      )}

      {/* Tab arrow */}
      {current.arrowTab && (
        <Animated.View style={[styles.arrowWrap, styles.arrowTab, { transform: [{ translateY: arrowBounce }] }]}>
          <View style={styles.arrowDown} />
        </Animated.View>
      )}

      {/* Content card */}
      <View style={styles.card}>
        <View style={styles.iconRow}>
          <PixelIcon name={current.icon} size={28} color={COLORS.gold} />
          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.skipBtn} onPress={dismiss}>
            <Text style={styles.skipText}>Hoppa över</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>{step === STEPS.length - 1 ? 'STARTA!' : 'NÄSTA'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.gold,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 24,
    gap: 12,
    paddingBottom: 36,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.greyDark },
  dotActive: { backgroundColor: COLORS.gold, width: 20 },
  title: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 13,
    fontFamily: 'Courier New',
    color: COLORS.offWhite,
    lineHeight: 20,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  skipBtn: { padding: 8 },
  skipText: { fontSize: 11, fontFamily: 'Courier New', color: COLORS.greyDark },
  nextBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderBottomWidth: 3,
    borderColor: '#8B6000',
  },
  nextText: { fontSize: 13, fontFamily: 'Courier New', fontWeight: 'bold', color: '#000', letterSpacing: 1 },

  // Arrows
  arrowWrap: { position: 'absolute', alignItems: 'center', zIndex: 1000 },
  arrowBottom: { bottom: 160, left: '50%', marginLeft: -16 },
  arrowTab: { bottom: 80, left: SW * 0.17, marginLeft: -16 },
  arrowDown: {
    width: 0, height: 0,
    borderLeftWidth: 16, borderRightWidth: 16, borderTopWidth: 24,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: COLORS.gold,
  },
})
