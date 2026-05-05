import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { COLORS } from '../../constants/colors'
import { s } from '../../lib/i18n'
import PixelIcon from '../ui/PixelIcon'

interface Props {
  visible: boolean
  onClaim: () => void
  onClose: () => void
  accentColor?: string
}

const AD_DURATION = 5

export default function AdRewardModal({ visible, onClaim, onClose, accentColor = COLORS.gold }: Props) {
  const [phase, setPhase] = useState<'intro' | 'watching' | 'done'>('intro')
  const [countdown, setCountdown] = useState(AD_DURATION)
  const barWidth = useRef(new Animated.Value(0)).current
  const glow = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    if (!visible) { setPhase('intro'); setCountdown(AD_DURATION) }
  }, [visible])

  useEffect(() => {
    if (phase !== 'watching') return
    barWidth.setValue(0)
    Animated.timing(barWidth, { toValue: 1, duration: AD_DURATION * 1000, useNativeDriver: false }).start()
    setCountdown(AD_DURATION)
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); setPhase('done'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1,   duration: 700, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0.3, duration: 700, useNativeDriver: false }),
    ])).start()
  }, [])

  const barColor = barWidth.interpolate({ inputRange: [0, 1], outputRange: [accentColor, '#00FF88'], extrapolate: 'clamp' })

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <PixelIcon name="gift" size={20} color={accentColor} />
            <Text style={[styles.title, { color: accentColor }]}>{s.adTitle.toUpperCase()}</Text>
          </View>

          {phase === 'intro' && (
            <>
              <Text style={styles.body}>{s.adBody}</Text>
              <View style={styles.rewardBox}>
                <Text style={[styles.rewardNum, { color: accentColor }]}>3x</Text>
                <Text style={styles.rewardSub}>{s.watchAdSub}</Text>
              </View>
              <TouchableOpacity
                style={[styles.btn, { borderColor: accentColor, backgroundColor: '#1A1A0A' }]}
                onPress={() => setPhase('watching')}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnText, { color: accentColor }]}>{s.adWatch}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}><Text style={styles.skip}>{s.later}</Text></TouchableOpacity>
            </>
          )}

          {phase === 'watching' && (
            <>
              <View style={styles.adScreen}>
                {/* Simulated ad screen */}
                <View style={styles.adPlaceholder}>
                  <Animated.View style={[styles.adGlow, { opacity: glow, borderColor: accentColor }]} />
                  <PixelIcon name="coin" size={40} color={accentColor} />
                  <Text style={[styles.adLabel, { color: accentColor }]}>AD</Text>
                  <Text style={styles.adSub}>{countdown}s</Text>
                </View>
              </View>
              <View style={styles.progressWrap}>
                <Animated.View style={[styles.progressBar, { flex: barWidth, backgroundColor: barColor }]} />
                <View style={styles.progressTrack} />
              </View>
              <Text style={styles.watchingText}>{s.adWatching} {countdown}s</Text>
            </>
          )}

          {phase === 'done' && (
            <>
              <View style={styles.doneBox}>
                <PixelIcon name="bolt" size={32} color={accentColor} />
                <Text style={[styles.doneTitle, { color: accentColor }]}>{s.adThanks}</Text>
                <Text style={styles.doneBody}>3x bonus · 60 sekunder</Text>
              </View>
              <TouchableOpacity
                style={[styles.btn, { borderColor: accentColor, backgroundColor: accentColor }]}
                onPress={onClaim}
                activeOpacity={0.85}
              >
                <Text style={[styles.btnText, { color: '#000' }]}>{s.adClaim}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, fontFamily: 'Courier New', fontWeight: 'bold', letterSpacing: 2 },
  body: { fontSize: 12, fontFamily: 'Courier New', color: COLORS.grey, textAlign: 'center', lineHeight: 18 },
  rewardBox: { alignItems: 'center', paddingVertical: 8 },
  rewardNum: { fontSize: 52, fontFamily: 'Courier New', fontWeight: 'bold' },
  rewardSub: { fontSize: 12, fontFamily: 'Courier New', color: COLORS.grey },
  btn: {
    width: '100%', paddingVertical: 14, alignItems: 'center',
    borderWidth: 2, borderBottomWidth: 4, borderRadius: 6,
  },
  btnText: { fontSize: 14, fontFamily: 'Courier New', fontWeight: 'bold', letterSpacing: 2 },
  skip: { fontSize: 11, fontFamily: 'Courier New', color: COLORS.greyDark },

  // Watching phase
  adScreen: { width: '100%', height: 140, borderRadius: 6, overflow: 'hidden', backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#222' },
  adPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  adGlow: { position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: 8, borderWidth: 2 },
  adLabel: { fontSize: 20, fontFamily: 'Courier New', fontWeight: 'bold', letterSpacing: 4 },
  adSub: { fontSize: 13, fontFamily: 'Courier New', color: COLORS.grey },
  progressWrap: { width: '100%', height: 6, backgroundColor: '#222', borderRadius: 3, flexDirection: 'row', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  progressTrack: { flex: 1, height: '100%' },
  watchingText: { fontSize: 11, fontFamily: 'Courier New', color: COLORS.grey },

  // Done phase
  doneBox: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  doneTitle: { fontSize: 18, fontFamily: 'Courier New', fontWeight: 'bold', letterSpacing: 1 },
  doneBody: { fontSize: 12, fontFamily: 'Courier New', color: COLORS.grey },
})
