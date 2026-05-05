import * as InAppPurchases from 'expo-in-app-purchases'
import AsyncStorage from '@react-native-async-storage/async-storage'

// App Store Connect product IDs — create these in App Store Connect first
export const IAP_PRODUCTS = {
  REMOVE_ADS:    'com.idlefactory.tycoon.removeads',    // $2.99 non-consumable
  STARTER_PACK:  'com.idlefactory.tycoon.starterpack',  // $0.99 consumable
  BOOST_PACK:    'com.idlefactory.tycoon.boostpack',    // $4.99 consumable
} as const

const ADS_REMOVED_KEY = 'ads_removed'

// ── Check if ads already removed (persisted purchase) ─────────────────────────
export async function isAdsRemoved(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ADS_REMOVED_KEY)
    return val === 'true'
  } catch { return false }
}

export async function setAdsRemoved(): Promise<void> {
  await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true')
}

// ── IAP Manager ───────────────────────────────────────────────────────────────
let initialized = false

export async function initIAP(): Promise<void> {
  if (initialized) return
  try {
    await InAppPurchases.connectAsync()
    initialized = true

    // Listen for purchases (handles pending + restored)
    InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
      if (responseCode !== InAppPurchases.IAPResponseCode.OK || !results) return
      for (const purchase of results) {
        await handlePurchase(purchase)
      }
    })

    // Restore purchases on init (catches previous Remove Ads buyers)
    await InAppPurchases.getPurchaseHistoryAsync()
  } catch { /* non-critical — IAP unavailable in simulator */ }
}

async function handlePurchase(purchase: InAppPurchases.InAppPurchase) {
  if (!purchase.acknowledged) {
    if (purchase.productId === IAP_PRODUCTS.REMOVE_ADS) {
      await setAdsRemoved()
    }
    await InAppPurchases.finishTransactionAsync(purchase, true)
  }
}

// ── Purchase functions ─────────────────────────────────────────────────────────
export async function purchaseRemoveAds(): Promise<boolean> {
  try {
    await InAppPurchases.getProductsAsync([IAP_PRODUCTS.REMOVE_ADS])
    await InAppPurchases.purchaseItemAsync(IAP_PRODUCTS.REMOVE_ADS)
    return true
  } catch { return false }
}

export async function purchaseStarterPack(): Promise<boolean> {
  try {
    await InAppPurchases.getProductsAsync([IAP_PRODUCTS.STARTER_PACK])
    await InAppPurchases.purchaseItemAsync(IAP_PRODUCTS.STARTER_PACK)
    return true
  } catch { return false }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    await InAppPurchases.getPurchaseHistoryAsync()
    return true
  } catch { return false }
}

export async function disconnectIAP(): Promise<void> {
  try { await InAppPurchases.disconnectAsync() } catch {}
}
