import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'

type SoundName = 'tap' | 'upgrade' | 'prestige' | 'combo' | 'daily' | 'milestone'

const SOURCES: Record<SoundName, any> = {
  tap:       require('../../assets/sounds/tap.mp3'),
  upgrade:   require('../../assets/sounds/upgrade.mp3'),
  prestige:  require('../../assets/sounds/prestige.mp3'),
  combo:     require('../../assets/sounds/combo.mp3'),
  daily:     require('../../assets/sounds/daily.mp3'),
  milestone: require('../../assets/sounds/milestone.mp3'),
}

class SoundManager {
  private enabled = true
  private loaded   = false

  async load() {
    if (this.loaded) return
    try {
      await setAudioModeAsync({ playsInSilentMode: false })
      this.loaded = true
    } catch { /* non-critical */ }
  }

  async play(name: SoundName) {
    if (!this.enabled || !this.loaded) return
    try {
      const player = createAudioPlayer(SOURCES[name])
      player.play()
    } catch { /* non-critical */ }
  }

  setEnabled(v: boolean) { this.enabled = v }
  async unload() { this.loaded = false }
}

export const soundManager = new SoundManager()
