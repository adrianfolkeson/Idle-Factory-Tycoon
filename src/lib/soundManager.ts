import { Audio } from 'expo-av'

// Sound files go in /assets/sounds/
// Add actual .mp3/.wav files and uncomment the load calls below.
// All calls are safe no-ops if sounds aren't loaded.

type SoundName = 'tap' | 'upgrade' | 'levelup' | 'prestige' | 'combo' | 'daily'

class SoundManager {
  private sounds: Partial<Record<SoundName, Audio.Sound>> = {}
  private enabled = true

  async load() {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: false })
      // Uncomment when audio files are added to /assets/sounds/:
      // const files: [SoundName, any][] = [
      //   ['tap',      require('../../assets/sounds/tap.mp3')],
      //   ['upgrade',  require('../../assets/sounds/upgrade.mp3')],
      //   ['levelup',  require('../../assets/sounds/levelup.mp3')],
      //   ['prestige', require('../../assets/sounds/prestige.mp3')],
      //   ['combo',    require('../../assets/sounds/combo.mp3')],
      //   ['daily',    require('../../assets/sounds/daily.mp3')],
      // ]
      // for (const [name, src] of files) {
      //   const { sound } = await Audio.Sound.createAsync(src, { shouldPlay: false })
      //   this.sounds[name] = sound
      // }
    } catch { /* non-critical */ }
  }

  async play(name: SoundName) {
    if (!this.enabled) return
    try {
      const sound = this.sounds[name]
      if (sound) {
        await sound.setPositionAsync(0)
        await sound.playAsync()
      }
    } catch { /* non-critical */ }
  }

  setEnabled(v: boolean) { this.enabled = v }

  async unload() {
    for (const s of Object.values(this.sounds)) {
      try { await s?.unloadAsync() } catch { /* noop */ }
    }
    this.sounds = {}
  }
}

export const soundManager = new SoundManager()
