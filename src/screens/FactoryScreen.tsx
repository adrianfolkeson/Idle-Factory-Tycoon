import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Animated } from 'react-native'
import * as Haptics from 'expo-haptics'
import { isWeb } from '../lib/platform'
import { useGame } from '../context/GameContext'
import { WORLDS } from '../constants/worlds'
import { COLORS } from '../constants/colors'
import { formatMoney } from '../lib/formatting'
import { s } from '../lib/i18n'
import MoneyDisplay from '../components/hud/MoneyDisplay'
import PixelIcon from '../components/ui/PixelIcon'
import FactoryBuilding from '../components/factory/FactoryBuilding'
import FloatingDollars, { useFloatingDollars } from '../components/hud/FloatingDollar'
import AdRewardModal from '../components/modals/AdRewardModal'
import DailyChallenges from '../components/factory/DailyChallenges'
import { soundManager } from '../lib/soundManager'
import { ActiveBoost } from '../types'

const { width: SW } = Dimensions.get('window')
const AD_COOLDOWN_SECS   = 5 * 60   // 5 min — 3x boost
const CASH_COOLDOWN_SECS = 10 * 60  // 10 min — cash bonus
const CASH_BONUS_SECS    = 300      // 5 minutes of passive income

export default function FactoryScreen() {
  const { state, dispatch, tap, productionRate, clickValue, skuggaVisible } = useGame()
  const world = WORLDS[state.currentWorldId]
  const [tapping, setTapping] = useState(false)
  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapScale   = useRef(new Animated.Value(1)).current
  const { items: floatItems, spawn: spawnFloat } = useFloatingDollars()

  // 3x boost ad
  const [showAd, setShowAd] = useState(false)
  const [adCooldown, setAdCooldown] = useState(0)
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const adPulse = useRef(new Animated.Value(1)).current
  const adGlow  = useRef(new Animated.Value(0)).current

  // Cash bonus ad
  const [showCashAd, setShowCashAd] = useState(false)
  const [cashCooldown, setCashCooldown] = useState(0)
  const cashCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cashPulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (adCooldown > 0) { adPulse.setValue(1); adGlow.setValue(0); return }
    Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(adPulse, { toValue: 1.06, duration: 700, useNativeDriver: false }),
        Animated.timing(adGlow,  { toValue: 1,    duration: 700, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(adPulse, { toValue: 1.0, duration: 700, useNativeDriver: false }),
        Animated.timing(adGlow,  { toValue: 0.3, duration: 700, useNativeDriver: false }),
      ]),
    ])).start()
  }, [adCooldown])

  useEffect(() => {
    if (cashCooldown > 0) { cashPulse.setValue(1); return }
    Animated.loop(Animated.sequence([
      Animated.timing(cashPulse, { toValue: 1.05, duration: 800, useNativeDriver: false }),
      Animated.timing(cashPulse, { toValue: 1.0,  duration: 800, useNativeDriver: false }),
    ])).start()
  }, [cashCooldown])

  const progress = state.worldProgress?.find(p => p.worldId === state.currentWorldId)
  const lastUpgradeId = world?.upgrades[world.upgrades.length - 1]?.id ?? ''
  const autoCount = progress?.upgrades.find(u => u.id === lastUpgradeId)?.count ?? 0
  const hasCombo  = state.activeBoosts.some(b => b.id === 'combo' && b.expiresAt > Date.now())

  const handleTap = useCallback((evt: any) => {
    tap()
    soundManager.play('tap')
    if (!isWeb) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const x = evt?.nativeEvent?.locationX ?? SW / 2
    const y = evt?.nativeEvent?.locationY ?? 40
    spawnFloat(x, y, clickValue)
    Animated.sequence([
      Animated.timing(tapScale, { toValue: 0.94, duration: 55, useNativeDriver: true }),
      Animated.timing(tapScale, { toValue: 1.00, duration: 80, useNativeDriver: true }),
    ]).start()
    setTapping(true)
    if (tapTimeout.current) clearTimeout(tapTimeout.current)
    tapTimeout.current = setTimeout(() => setTapping(false), 200)
  }, [tap, clickValue, spawnFloat])

  const handleAdClaim = useCallback(() => {
    setShowAd(false)
    const boost: ActiveBoost = {
      id: 'ad_reward',
      multiplier: 3,
      expiresAt: Date.now() + 60_000,
    }
    dispatch({ type: 'ADD_BOOST', boost })
    // Start cooldown
    setAdCooldown(AD_COOLDOWN_SECS)
    if (cooldownInterval.current) clearInterval(cooldownInterval.current)
    cooldownInterval.current = setInterval(() => {
      setAdCooldown(c => {
        if (c <= 1) {
          clearInterval(cooldownInterval.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }, [dispatch])

  const cashBonus = Math.max(100, productionRate * CASH_BONUS_SECS)

  const handleCashAdClaim = useCallback(() => {
    setShowCashAd(false)
    dispatch({ type: 'TAP', clickValue: cashBonus })
    soundManager.play('daily')
    if (!isWeb) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setCashCooldown(CASH_COOLDOWN_SECS)
    if (cashCooldownRef.current) clearInterval(cashCooldownRef.current)
    cashCooldownRef.current = setInterval(() => {
      setCashCooldown(c => {
        if (c <= 1) { clearInterval(cashCooldownRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }, [dispatch, cashBonus])

  useEffect(() => {
    return () => {
      const id = cooldownInterval.current
      if (id != null) clearInterval(id)
      const id2 = cashCooldownRef.current
      if (id2 != null) clearInterval(id2)
    }
  }, [])

  if (!world) return null
  const accent = world.theme.accent
  const adBoost = state.activeBoosts.find(b => b.id === 'ad_reward' && b.expiresAt > Date.now())

  return (
    <View style={[styles.root, { backgroundColor: world.theme.sky }]}>
      <MoneyDisplay />

      <View style={styles.factoryWrap}>
        <FactoryBuilding
          theme={world.theme}
          skuggaVisible={skuggaVisible}
          tapping={tapping}
          productionRate={productionRate}
          worldName={world.name}
          autoUpgradeCount={autoCount}
          tier={state.currentWorldId}
          worldId={state.currentWorldId}
        />
      </View>

      {/* Daily challenges */}
      <DailyChallenges accent={accent} />

      {/* Bottom bar: [3x LEFT] [KLICKA CENTER] [CASH RIGHT] */}
      <View style={styles.bottomBar}>

        {/* LEFT — 3x boost ad */}
        <TouchableOpacity
          onPress={() => adCooldown === 0 && !adBoost && setShowAd(true)}
          activeOpacity={adCooldown > 0 || adBoost ? 1 : 0.75}
        >
          <Animated.View style={[
            styles.adBtn,
            adCooldown > 0 && styles.adBtnCooldown,
            adBoost && styles.adBtnActive,
            !adCooldown && !adBoost && {
              borderColor: adGlow.interpolate({ inputRange:[0,1], outputRange:[accent+'88', accent] }),
              shadowColor: accent, shadowOpacity: adGlow, shadowRadius: 10,
            },
            { transform: [{ scale: adCooldown > 0 || adBoost ? 1 : adPulse }] },
          ]}>
            {adBoost ? (
              <><PixelIcon name="bolt" size={11} color="#00FF88" />
                <Text style={[styles.adBigNum, { color:'#00FF88' }]}>3x</Text>
                <Text style={[styles.adSub, { color:'#00CC66' }]}>AKTIV</Text></>
            ) : adCooldown > 0 ? (
              <><PixelIcon name="warning" size={12} color="#444" />
                <Text style={[styles.adBigNum, { color:'#444' }]}>
                  {Math.floor(adCooldown/60)}:{String(adCooldown%60).padStart(2,'0')}
                </Text>
                <Text style={[styles.adSub, { color:'#333' }]}>VÄNTAR</Text></>
            ) : (
              <><PixelIcon name="gift" size={13} color={accent} />
                <Text style={[styles.adBigNum, { color: accent }]}>3x</Text>
                <Text style={[styles.adSub, { color: accent+'BB' }]}>GRATIS</Text></>
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* CENTER — Tap button */}
        <TouchableOpacity
          onPress={handleTap}
          activeOpacity={1}
          style={styles.tapOuter}
        >
          <Animated.View style={[
            styles.tapBtn,
            { borderColor: accent, shadowColor: accent },
            hasCombo && styles.tapBtnCombo,
            { transform: [{ scale: tapScale }] },
          ]}>
            <View style={[styles.tapBtnInner, { backgroundColor: hasCombo ? '#3A0000' : '#111' }]}>
              <PixelIcon name={world.icon} size={22} color={accent} />
              <Text style={[styles.tapMain, { color: accent }]}>
                {hasCombo ? s.combo : s.click}
              </Text>
              <Text style={styles.tapSub}>
                +{clickValue >= 1 ? formatMoney(clickValue) : `$${clickValue.toFixed(2)}`}{s.perClick}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* RIGHT — cash bonus ad */}
        <TouchableOpacity
          onPress={() => cashCooldown === 0 && setShowCashAd(true)}
          activeOpacity={cashCooldown > 0 ? 1 : 0.75}
        >
          <Animated.View style={[
            styles.adBtn,
            cashCooldown > 0 && styles.adBtnCooldown,
            cashCooldown === 0 && { borderColor:'#00CC88', shadowColor:'#00AA66', shadowOpacity:0.6, shadowRadius:8 },
            { transform:[{ scale: cashCooldown > 0 ? 1 : cashPulse }] },
          ]}>
            {cashCooldown > 0 ? (
              <><PixelIcon name="coin" size={12} color="#444" />
                <Text style={[styles.adBigNum, { color:'#444', fontSize:12 }]}>
                  {Math.floor(cashCooldown/60)}:{String(cashCooldown%60).padStart(2,'0')}
                </Text>
                <Text style={[styles.adSub, { color:'#333' }]}>VÄNTAR</Text></>
            ) : (
              <><PixelIcon name="coin" size={13} color="#00CC88" />
                <Text style={[styles.adBigNum, { color:'#00CC88' }]}>{formatMoney(cashBonus)}</Text>
                <Text style={[styles.adSub, { color:'#00AA66' }]}>GRATIS</Text></>
            )}
          </Animated.View>
        </TouchableOpacity>

      </View>

      <FloatingDollars items={floatItems} />

      <AdRewardModal
        visible={showAd}
        onClaim={handleAdClaim}
        onClose={() => setShowAd(false)}
        accentColor={accent}
      />
      <AdRewardModal
        visible={showCashAd}
        onClaim={handleCashAdClaim}
        onClose={() => setShowCashAd(false)}
        accentColor="#00CC88"
        cashBonus={cashBonus}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  factoryWrap: { flex: 1, overflow: 'hidden' },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 4,
    gap: 10,
  },
  adBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderRadius: 10,
    borderColor: COLORS.border,
    backgroundColor: '#111',
    minWidth: 58,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  adBtnCooldown: { borderColor: '#1A1A1A', backgroundColor: '#0A0A0A' },
  adBtnActive:   { borderColor: '#00FF88', backgroundColor: '#001A0A' },
  adBigNum: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: 18,
  },
  adSub: {
    fontSize: 7,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  tapOuter: { flex: 1 },
  tapBtn: {
    borderWidth: 2.5,
    borderRadius: 14,
    borderBottomWidth: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  tapBtnCombo: {
    borderColor: '#FF4444',
    shadowColor: '#FF2200',
  },
  tapBtnInner: {
    borderRadius: 11,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  tapMain: {
    fontSize: 22,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  tapSub: {
    fontSize: 11,
    fontFamily: 'Courier New',
    color: COLORS.grey,
  },
})
