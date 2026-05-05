// Sound manager using expo-audio (SDK 53+)
// Add .mp3 files to /assets/sounds/ then uncomment the imports below.

// import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'

// ── Recommended free sounds (freesound.org) ──────────────────────────────────
// tap.mp3      → search "coin click" ~0.1s       (e.g. freesound #341695)
// upgrade.mp3  → search "level up chime" ~0.5s   (e.g. freesound #270402)
// prestige.mp3 → search "epic fanfare" ~2s        (e.g. freesound #270528)
// combo.mp3    → search "power up" ~0.4s          (e.g. freesound #171671)
// daily.mp3    → search "reward collect" ~0.7s    (e.g. freesound #397354)
// milestone.mp3→ search "achievement" ~0.6s       (e.g. freesound #341695)
// ─────────────────────────────────────────────────────────────────────────────

type SoundName = 'tap' | 'upgrade' | 'prestige' | 'combo' | 'daily' | 'milestone'

// When files are ready, replace this map with createAudioPlayer calls:
// const PLAYERS: Record<SoundName, ReturnType<typeof createAudioPlayer>> = {
//   tap:       createAudioPlayer(require('../../assets/sounds/tap.mp3')),
//   upgrade:   createAudioPlayer(require('../../assets/sounds/upgrade.mp3')),
//   prestige:  createAudioPlayer(require('../../assets/sounds/prestige.mp3')),
//   combo:     createAudioPlayer(require('../../assets/sounds/combo.mp3')),
//   daily:     createAudioPlayer(require('../../assets/sounds/daily.mp3')),
//   milestone: createAudioPlayer(require('../../assets/sounds/milestone.mp3')),
// }

class SoundManager {
  private enabled = true
  private loaded   = false

  async load() {
    if (this.loaded) return
    try {
      // await setAudioModeAsync({ playsInSilentModeIOS: false, shouldDuckAndroid: true })
      this.loaded = true
    } catch { /* non-critical */ }
  }

  async play(name: SoundName) {
    if (!this.enabled || !this.loaded) return
    try {
      // const player = PLAYERS[name]
      // if (player) { player.seekTo(0); player.play() }
    } catch { /* non-critical */ }
  }

  setEnabled(v: boolean) { this.enabled = v }
  async unload() { this.loaded = false }
}

export const soundManager = new SoundManager()
