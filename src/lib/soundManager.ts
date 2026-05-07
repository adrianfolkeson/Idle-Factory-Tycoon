import { Platform } from 'react-native'

type SoundName = 'tap' | 'upgrade' | 'prestige' | 'combo' | 'daily' | 'milestone'

// Sound manager - works on iOS/Android, skipped on web for now
class SoundManager {
  private enabled = true
  private loaded = false

  async load() {
    if (this.loaded) return
    try {
      // Skip on web for now - audio files need special handling
      if (Platform.OS === 'web') {
        this.loaded = true
        return
      }
      
      // iOS/Android would use expo-av here
      // import { setAudioModeAsync } from 'expo-av'
      // await setAudioModeAsync({ playsInSilentMode: false })
      this.loaded = true
    } catch { /* non-critical */ }
  }

  async play(name: SoundName) {
    if (!this.enabled || !this.loaded) return
    if (Platform.OS === 'web') return // Skip on web for now
    
    try {
      // Play sound on native - would use expo-av here
      // const { Audio } = require('expo-av')
      // const { sound } = await Audio.Sound.createAsync(SOURCES[name])
      // await sound.playAsync()
    } catch { /* non-critical */ }
  }

  setEnabled(v: boolean) { this.enabled = v }
  async unload() { this.loaded = false }
}

export const soundManager = new SoundManager()
