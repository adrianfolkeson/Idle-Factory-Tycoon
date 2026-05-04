import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

const NOTIF_IDS = {
  idle: 'factory_idle',
  comeback: 'factory_comeback',
}

export async function scheduleFactoryNotifications(productionRate: number, dollars: number) {
  await cancelFactoryNotifications()

  const earned2h = productionRate * 7200
  const earned8h = productionRate * 28800

  if (earned2h >= 1) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIF_IDS.idle,
      content: {
        title: 'Fabriken rullar!',
        body: `Du har tjänat ~$${formatCompact(earned2h)} medan du var borta. Hämta nu!`,
        sound: true,
      },
      trigger: { seconds: 7200, repeats: false } as any,
    })
  }

  if (earned8h >= 1) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIF_IDS.comeback,
      content: {
        title: 'Bosse saknar dig!',
        body: `BUSSE har jobbat i 8 timmar. Kom tillbaka och hämta dina pengar!`,
        sound: true,
      },
      trigger: { seconds: 28800, repeats: false } as any,
    })
  }
}

export async function cancelFactoryNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

function formatCompact(n: number): string {
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return `${Math.floor(n)}`
}
