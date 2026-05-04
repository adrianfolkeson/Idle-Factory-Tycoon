// Sound manager — ready for expo-audio (SDK 53+)
// Add .mp3 files to /assets/sounds/ and wire up expo-audio when ready.
// All methods are safe no-ops until audio files are provided.

type SoundName = 'tap' | 'upgrade' | 'levelup' | 'prestige' | 'combo' | 'daily'

class SoundManager {
  private enabled = true

  async load() { /* wire up expo-audio here when sound files are added */ }

  async play(_name: SoundName) {
    if (!this.enabled) return
    // e.g.: const player = useAudioPlayer(require('../../assets/sounds/tap.mp3'))
    //       player.play()
  }

  setEnabled(v: boolean) { this.enabled = v }

  async unload() { /* cleanup */ }
}

export const soundManager = new SoundManager()
