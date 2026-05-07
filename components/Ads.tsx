import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

// Web: persistent banner via Google AdSense (inject once)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const existing = document.getElementById('adsense-script')
  if (!existing) {
    const s = document.createElement('script')
    s.id = 'adsense-script'
    s.async = true
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2551267052794968'
    s.crossOrigin = 'anonymous'
    document.head.appendChild(s)
  }
}

// Native: AdMob banner
let MobileAds: any, BannerAd: any, BannerAdSize: any, TestIds: any
if (Platform.OS !== 'web') {
  try {
    const admob = require('react-native-google-mobile-ads')
    MobileAds = admob.default; BannerAd = admob.BannerAd
    BannerAdSize = admob.BannerAdSize; TestIds = admob.TestIds
  } catch {}
}

// Use test IDs during development, real IDs in production
const IS_DEV = __DEV__

export default function Ads() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: AdSense auto-ad handles placement — show container immediately
      setReady(true)
      return
    }
    if (!MobileAds) return
    MobileAds()
      .initialize()
      .then(() => setReady(true))
      .catch(() => {})
  }, [])

  if (!ready) return null

  // Web: Google AdSense persistent leaderboard banner
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {/* @ts-ignore web-only */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: 60 }}
          data-ad-client="ca-pub-2551267052794968"
          data-ad-slot="8553436140"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        {typeof window !== 'undefined' && (() => {
          try { (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}) } catch {}
          return null
        })()}
      </View>
    )
  }

  // Native: AdMob
  if (!BannerAd || !BannerAdSize || !TestIds) return null
  const BANNER_ID = IS_DEV
    ? TestIds.BANNER
    : Platform.select({ ios: 'ca-app-pub-2551267052794968/8553436140', android: 'ca-app-pub-2551267052794968/8553436140' })!

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
})
