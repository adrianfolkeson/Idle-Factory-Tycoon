import AsyncStorage from '@react-native-async-storage/async-storage'
import { GameState } from '../types'

const SAVE_KEY = '@idle_factory_v1'

export async function saveGame(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }))
  } catch (e) {
    console.warn('Save failed:', e)
  }
}

export async function loadGame(): Promise<GameState | null> {
  try {
    const data = await AsyncStorage.getItem(SAVE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data) as GameState
    if (parsed.version !== 1) return null
    return parsed
  } catch (e) {
    console.warn('Load failed:', e)
    return null
  }
}

export async function clearSave(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY)
}
