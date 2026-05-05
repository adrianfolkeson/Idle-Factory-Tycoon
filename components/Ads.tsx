import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import MobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads'

// Use test IDs during development, real IDs in production
const IS_DEV = __DEV__

const BANNER_ID = IS_DEV
  ? TestIds.BANNER
  : Platform.select({
      ios:     'ca-app-pub-2551267052794968/8553436140',
      android: 'ca-app-pub-2551267052794968/8553436140',
    })!

export default function Ads() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => setReady(true))
      .catch(() => {}) // fail silently
  }, [])

  if (!ready) return null

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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
})
