// In-App Purchases — stubbed until EAS production build
// expo-in-app-purchases requires native binary inclusion.
// Steps to activate:
//   1. npx expo install expo-in-app-purchases
//   2. Add products in App Store Connect
//   3. npx expo prebuild --clean && eas build --profile production
//   4. Uncomment real implementation below

import AsyncStorage from '@react-native-async-storage/async-storage'

export const IAP_PRODUCTS = {
  REMOVE_ADS:   'com.idlefactory.tycoon.removeads',   // $2.99 non-consumable
  STARTER_PACK: 'com.idlefactory.tycoon.starterpack', // $0.99 consumable
} as const

const ADS_KEY = 'ads_removed'

export async function isAdsRemoved(): Promise<boolean> {
  try { return (await AsyncStorage.getItem(ADS_KEY)) === 'true' }
  catch { return false }
}

export async function setAdsRemoved(): Promise<void> {
  await AsyncStorage.setItem(ADS_KEY, 'true')
}

// ── Stub functions — safe no-ops until native build ───────────────────────────
export async function initIAP(): Promise<void> {}

export async function purchaseRemoveAds(): Promise<boolean> {
  // TODO: implement with expo-in-app-purchases after EAS build
  return false
}

export async function purchaseStarterPack(): Promise<boolean> {
  // TODO: implement with expo-in-app-purchases after EAS build
  return false
}

export async function restorePurchases(): Promise<void> {}

export async function disconnectIAP(): Promise<void> {}
