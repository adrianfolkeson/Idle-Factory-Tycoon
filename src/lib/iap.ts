// expo-in-app-purchases requires a native build.
// All functions are safe no-ops until included in an EAS build.
// Add 'expo-in-app-purchases' to app.json plugins, then run:
//   npx expo prebuild --clean && npx expo run:ios

import AsyncStorage from '@react-native-async-storage/async-storage'

export const IAP_PRODUCTS = {
  REMOVE_ADS:   'com.idlefactory.tycoon.removeads',
  STARTER_PACK: 'com.idlefactory.tycoon.starterpack',
} as const

const ADS_REMOVED_KEY = 'ads_removed'

export async function isAdsRemoved(): Promise<boolean> {
  try { return (await AsyncStorage.getItem(ADS_REMOVED_KEY)) === 'true' }
  catch { return false }
}

export async function setAdsRemoved(): Promise<void> {
  await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true')
}

// Lazy-load the native module so missing module doesn't crash on import
async function getIAP() {
  try {
    return await import('expo-in-app-purchases')
  } catch {
    return null
  }
}

let initialized = false

export async function initIAP(): Promise<void> {
  if (initialized) return
  const IAP = await getIAP()
  if (!IAP) return
  try {
    await IAP.connectAsync()
    initialized = true
    IAP.setPurchaseListener(async ({ responseCode, results }) => {
      if (responseCode !== IAP.IAPResponseCode.OK || !results) return
      for (const purchase of results) {
        if (!purchase.acknowledged) {
          if (purchase.productId === IAP_PRODUCTS.REMOVE_ADS) await setAdsRemoved()
          await IAP.finishTransactionAsync(purchase, true)
        }
      }
    })
    await IAP.getPurchaseHistoryAsync()
  } catch { /* native module not available */ }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  const IAP = await getIAP()
  if (!IAP) return false
  try {
    await IAP.getProductsAsync([IAP_PRODUCTS.REMOVE_ADS])
    await IAP.purchaseItemAsync(IAP_PRODUCTS.REMOVE_ADS)
    return true
  } catch { return false }
}

export async function purchaseStarterPack(): Promise<boolean> {
  const IAP = await getIAP()
  if (!IAP) return false
  try {
    await IAP.getProductsAsync([IAP_PRODUCTS.STARTER_PACK])
    await IAP.purchaseItemAsync(IAP_PRODUCTS.STARTER_PACK)
    return true
  } catch { return false }
}

export async function restorePurchases(): Promise<void> {
  const IAP = await getIAP()
  if (!IAP) return
  try { await IAP.getPurchaseHistoryAsync() } catch {}
}

export async function disconnectIAP(): Promise<void> {
  const IAP = await getIAP()
  if (!IAP) return
  try { await IAP.disconnectAsync() } catch {}
}
