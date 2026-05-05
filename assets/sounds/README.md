# Sound Effects

Add these files here, then uncomment the code in src/lib/soundManager.ts.

| File | Description | Source suggestion |
|------|-------------|-------------------|
| `tap.mp3` | Short coin clink ~0.1s | freesound.org #341695 |
| `upgrade.mp3` | Ascending chime ~0.5s | freesound.org #270402 |
| `prestige.mp3` | Epic fanfare ~2s | freesound.org #270528 |
| `combo.mp3` | Power-up whoosh ~0.4s | freesound.org #171671 |
| `daily.mp3` | Reward collect ~0.7s | freesound.org #397354 |
| `milestone.mp3` | Achievement unlock ~0.6s | freesound.org #341695 |

All files should be: MP3, mono, 44100 Hz, ~128kbps.

After adding files:
1. Open src/lib/soundManager.ts
2. Uncomment all commented lines
3. Rebuild the app
