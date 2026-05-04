import AsyncStorage from '@react-native-async-storage/async-storage'
import * as StoreReview from 'expo-store-review'

const KEY = 'session_count'
const RATED_KEY = 'has_rated'
const PROMPT_SESSIONS = [3, 7, 15]  // prompt at sessions 3, 7, 15

export async function trackSessionAndMaybeRate() {
  try {
    const [countStr, hasRated] = await Promise.all([
      AsyncStorage.getItem(KEY),
      AsyncStorage.getItem(RATED_KEY),
    ])
    if (hasRated) return

    const count = parseInt(countStr ?? '0', 10) + 1
    await AsyncStorage.setItem(KEY, String(count))

    if (PROMPT_SESSIONS.includes(count)) {
      const isAvailable = await StoreReview.isAvailableAsync()
      if (isAvailable) {
        await StoreReview.requestReview()
        await AsyncStorage.setItem(RATED_KEY, 'true')
      }
    }
  } catch { /* non-critical */ }
}
