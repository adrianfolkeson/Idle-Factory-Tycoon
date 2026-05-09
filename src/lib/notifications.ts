// expo-notifications requires a native build (EAS).
// All functions fail silently in Expo Go.
import { isWeb } from './platform'

async function getNotifications() {
  try { return await import('expo-notifications') } catch { return null }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (isWeb) return false
  try {
    const N = await getNotifications()
    if (!N) return false
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, shouldShowBanner: true,
        shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
      }),
    })
    const { status } = await N.requestPermissionsAsync()
    return status === 'granted'
  } catch { return false }
}

export async function scheduleFactoryNotifications(productionRate: number, _dollars: number) {
  if (isWeb) return
  try {
    const N = await getNotifications()
    if (!N) return
    await N.cancelAllScheduledNotificationsAsync()
    const earned2h = productionRate * 7200
    const earned8h = productionRate * 28800
    if (earned2h >= 1) {
      await N.scheduleNotificationAsync({
        identifier: 'factory_idle',
        content: { title: 'Fabriken rullar!', body: `~$${fmt(earned2h)} tjänat. Hämta nu!`, sound: true },
        trigger: { seconds: 7200, repeats: false } as any,
      })
    }
    if (earned8h >= 1) {
      await N.scheduleNotificationAsync({
        identifier: 'factory_comeback',
        content: { title: 'Bosse saknar dig!', body: 'BUSSE har jobbat i 8 timmar. Kom tillbaka!', sound: true },
        trigger: { seconds: 28800, repeats: false } as any,
      })
    }
  } catch { /* silent in Expo Go */ }
}

export async function cancelFactoryNotifications() {
  if (isWeb) return
  try { const N = await getNotifications(); await N?.cancelAllScheduledNotificationsAsync() } catch {}
}

function fmt(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return `${Math.floor(n)}`
}
