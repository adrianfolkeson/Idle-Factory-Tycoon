# 🏭 IDLE FACTORY TYCOON - Detaljerad Plan

## 🎮 SPELKONCEPT

### Story
Du är **Bosse**, en 50-årig pensionär som precis köpt en rostig,fallen-fabrik. Med hjälp av din gamla trogna robot **"BUSSE"** (Byråns Unika Servo-SystemExpedit) ska du bygga upp fabriken, producera varor, sälja, och bli fabrik-tycoon!

### Progression
```
🏭 Rostig Fabrik → ⚡ Energifabrik → 🧪 Laboratorium → 🚀 Rymdfabrik → 🌌 Kosmisk Fabrik → 🔮 Magisk Fabrik
```

Varje nivå börjar från scratch men med samma mekanik - rolig resa!

---

## 📱 SKÄRMAR

### 1. Huvudskärm (Fabriken)
**Vad som syns:**
- 🏭 Fabriksbyggnad (pixel art, animerad)
- 🤖 BUSSE roboten (går runt, arbetar)
- 👷 Bysse (står och pekar/klickar)
- 📦 Produktionsband (rör sig)
- 💰 Dollar-räknare (ses partout)
- ⚙️ Uppgraderingsknappar

**Bakgrund:**
- Mörk/brun/grön färg
- Ibland springer en **skugga** förbi (stalker-style! 👻)
- partiklar/rök från skorstenarna

### 2. Uppgraderingsmeny
**Uppgraderingar per fabrik:**

| Typ | Exempel | Kostnad | Effekt |
|-----|----------|---------|--------|
| 🏭 Byggnader | Ny byggnad | 100$ | +1/sec |
| ⚙️ Maskiner | Finare maskin | 500$ | +5/sec |
| 🤖 Robotar | Fler robotar | 2500$ | +20/sec |
| 📦 Produktion | Snabbare band | 10000$ | +100/sec |
| 👔 Arbetskraft | Anställ arbetare | 50000$ | +500/sec |
| 🧠 Automation | Fullt automatiskt | 250000$ | +2000/sec |

### 3. Shop/Världar
**Värld 1: Rostig Fabrik** (grön/brun)
- Producerar: Skruvar & muttrar
- Theme: Gammal industri

**Värld 2: Energifabrik** (gul/orange) - KRÄVS: 1,000,000$
- Producerar: Batterier
- Theme: Kraftwerk

**Värld 3: Laboratorium** (lila/blå) - KRÄVS: 10,000,000$
- Producerar: Piller
- Theme: Sci-fi

**Värld 4: Rymdfabrik** (mörkblå/guld) - KRÄVS: 100,000,000$
- Producerar: Satelliter
- Theme: Space

### 4. Dagliga Belöningar
**7-dagars cykel:**
| Dag | Belöning |
|-----|----------|
| 1 | 1x production boost |
| 2 | 100$ |
| 3 | 2x production boost |
| 4 | 500$ |
| 5 | 3x production boost |
| 6 | 1000$ |
| 7 | 5x production boost + Badge! |

### 5. Statistik-Sida
- 💰 Totalt intjänat
- ⏱️ Tid spelad
- 🏭 Fabriker avslutade
- 🤖 Roboter ägda
- 🏆 Badges/Achievements

### 6. Inställningar
- 🔔 Notiser på/av
- 📱 Hemskärmsikon aktivering
- 💾 Manuell spara-knapp
- 🔄 Återställ framt

---

## 👥 KARAKTÄRER

### 👴 BOSSE (Huvudperson)
- 50 år gammal
- Liten (pixel art)
- Klädd i overall
- Står och pekar/klickar
- Uttryck: Nöjd när det går bra, bekymrad när det går dålt

### 🤖 BUSSE (Robot)
- Gammaldags robot (inte modern)
- Rostigt utseende
- Går runt och arbetar
- Servomtrummor istället för ben
- Glödlampor som ögon

### 👻 SKUGGA (Spöke)
- Springrande förbi ibland
- Ingen farlig, bara creepy
- Ger +10% production boost när den syns (mystik!)

---

## 💰 EKONOMI

### Dollar-generering
```
Base Production = Fabriksnivå × Maskiner × Roboter × Automation
Boosted = Base × Daglig-boost × Skugga × Achievements
```

### Uppgraderingskostnader (Exempel Värld 1)
```
Maskin: 100$ → 500$ → 2500$ → 10000$
Robot: 500$ → 2500$ → 12000$ → 60000$
Fabrik: 1000$ → 5000$ → 25000$ → 100000$
```

---

## 🎨 DESIGN SPEC

### Färgpalett
| Färg | Hex | Användning |
|-------|-----|-----------|
| 🟤 Brun | #3D2914 | Primär |
| ⚫ Svart | #1A1A1A | Bakgrund |
| 🟢 Grön | #2D5A27 | Accent |
| 🟡 Gul | #C4A000 | Coins/Guld |
| 🔴 Röd | #8B0000 | Warning |
| ⚪ Vit | #E8E8E8 | Text |

### Pixel Art Stil
- 16-bit era stil
- 4K-upplöst (retina)
- Animerade sprites (8 fps för characters, 2 fps för bakgrund)
- Partikeleffekter (rök, gnistor)

### Ikoner
- Pixel art ikoner
- 64x64px standard
- Dollar-tecken ($)
- Kugghjul
- Robot-hjälm
- Fabrik-skorsten

---

## 📲 TEKNISK SPEC

### Framework
- **React Native + Expo** (som MatKoll)
- **AsyncStorage** för sparning
- **Hemskärmsikon** (Expo Notifications + widget)

### State Management
```typescript
interface GameState {
  currentWorld: number
  dollars: number
  totalEarned: number
  productionRate: number
  upgrades: Upgrade[]
  dailyReward: {
    lastClaimed: Date
    streak: number
  }
  stats: {
    timePlayed: number
    factoriesCompleted: number
    badges: string[]
  }
}
```

### Offline-Support
- Fullt offline-spel (inga servrar)
- All data sparas lokalt
- Hemskärmsikon = notifikation när produktion är redo

---

## 🎮 FEATURES (PRIORITETSORDNING)

### Måste ha (MVP)
1. ✅ Klick-mekanik
2. ✅ Dollar-räknare
3. ✅ Uppgraderingssystem
4. ✅ Auto-spara
5. ✅ Dagliga belöningar
6. ✅ 4 världar

### Bra att ha
1. 🎁 Achievements/badges
2. 👻 Skugga-grejen
3. 📊 Statistik-sida
4. 🖼️ Hemskärmsikon
5. 🔔 Notiser

### Future
1. 🎵 Ljud/musik
2. 🎨 Anpassning (färg på robot)
3. 🏆 Leaderboard (online)

---

## 🗓️ UTVERKLINGSPLAN

### Vecka 1: Grunden
- [ ] Projekt setup
- [ ] Huvudskärm med klick
- [ ] Dollar-räknare
- [ ] Enkelt uppgraderingssystem

### Vecka 2: Fabrik 1
- [ ] Pixel art resurser
- [ ] Alla uppgraderingar
- [ ] BUSSE-robot animering
- [ ] Auto-spara

### Vecka 3: Världar + Progression
- [ ] 4 världar
- [ ] Världs-unlocks
- [ ] Dagliga belöningar
- [ ] Bysse karaktär

### Vecka 4: Polering
- [ ] 👻 Skugga
- [ ] Achievements
- [ ] Statistik
- [ ] Hemskärmsikon
- [ ] Bugfixes

---

## 💾 SPAR-SYSTEM

### Auto-spara
- Sparar var 10:e sekund
- Sparar vid app-stängning
- Sparar vid world-byte

### Data som sparas
```json
{
  "version": "1.0",
  "dollars": 1234567,
  "world": 1,
  "upgrades": {...},
  "daily": {...},
  "stats": {...},
  "lastPlayed": "2024-01-01"
}
```

---

## 🎯 ACHIEVEMENTS

| Badge | Krav |
|-------|------|
| 🏭 Nybörjare | Köp första uppgraderingen |
| 💰 Rik | Tjäna 1,000,000$ |
| 🤖 Robottek | Köp 10 robotar |
| 🏆 Tycoon | Avsluta alla världar |
| ⏰ Dedikerad | Spela 7 dagar i rad |
| 👻 Skuggsprinter | Hitta skuggan 100 gånger |

---

## 📱 HEMSKÄRMSIKON

**Koncept:** När produktionen tickar, visas en ikon som:
- Visar dollar/sek
- Klick = öppnar appen
- Notifikation: "Fabriken har producerat 1000$!"

---

## 🎵 MUSIK/LJUD (FUTURE)

- 🏭 Industrial music (Värld 1)
- ⚡ Epic music (Värld 2)
- 🧪 Mystisk (Värld 3)
- 🚀 Space synth (Värld 4)
- 👆 Klick-ljud
- 💰 Coin-ljud
- 🤖 Robot-steg

---

## 🏁 NÄSTA STEG

1. ✅ Godkänn planen
2. ✅ Börja koda!
3. 🎮 Spela!

---

**Är du redo att bygga? 🚀**
