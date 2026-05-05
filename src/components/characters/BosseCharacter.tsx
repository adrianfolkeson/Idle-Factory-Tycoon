import React, { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'

interface Props {
  tapping?: boolean
  size?: number
  relaxing?: boolean
  worldId?: number
}

// ── World costume data ────────────────────────────────────────────────────────
interface Costume {
  hatColor: string
  hatAccent: string
  overalls: string
  bib: string
  strap: string
  detail?: string  // extra accent on body
}

const COSTUMES: Record<number, Costume> = {
  0: { hatColor: '#FFB800', hatAccent: '#CC8800', overalls: '#2244AA', bib: '#3355CC', strap: '#3355CC' },
  1: { hatColor: '#FF8800', hatAccent: '#CC5500', overalls: '#AA5500', bib: '#CC7700', strap: '#FFB800', detail: '#FFE000' },
  2: { hatColor: '#F8F8F8', hatAccent: '#DDDDDD', overalls: '#F2F2F2', bib: '#FFFFFF', strap: '#E0E0E0', detail: '#00CCDD' },
  3: { hatColor: '#E8EEFF', hatAccent: '#8899CC', overalls: '#D8E8F8', bib: '#FFFFFF', strap: '#BBCCEE', detail: '#2244AA' },
  4: { hatColor: '#888888', hatAccent: '#555555', overalls: '#5A3A14', bib: '#7A5A2A', strap: '#6A4820', detail: '#C8860A' },
  5: { hatColor: '#D4C090', hatAccent: '#A89060', overalls: '#8B7440', bib: '#A89050', strap: '#988040', detail: '#7EC800' },
  6: { hatColor: '#333333', hatAccent: '#111111', overalls: '#004466', bib: '#006688', strap: '#0077AA', detail: '#00BBFF' },
  7: { hatColor: '#1A1A1A', hatAccent: '#111111', overalls: '#1A1A1A', bib: '#FF4400', strap: '#FF5500', detail: '#FF4400' },
  8: { hatColor: '#8B6914', hatAccent: '#5A4008', overalls: '#2A5A18', bib: '#3A7A24', strap: '#356A22', detail: '#00CC55' },
  9: { hatColor: '#111122', hatAccent: '#0022AA', overalls: '#111122', bib: '#FF00CC', strap: '#CC00AA', detail: '#FF00CC' },
}

const SKIN  = '#F4A460'
const BROWN = '#3D2914'

// ── Hat components per world ──────────────────────────────────────────────────

function Hat0({ c }: { c: Costume }) { // Hard hat
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.hatBrim, { backgroundColor: c.hatColor }]} />
      <View style={[styles.hatTop, { backgroundColor: c.hatColor }]} />
    </View>
  )
}

function Hat1({ c }: { c: Costume }) { // Energy hard hat + bolt
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.hatBrim, { backgroundColor: c.hatColor }]} />
      <View style={[styles.hatTop, { backgroundColor: c.hatColor }]}>
        <View style={{ position:'absolute', top:1, left:7, width:4, height:6, backgroundColor:c.detail, borderRadius:1, transform:[{rotate:'15deg'}] }} />
      </View>
    </View>
  )
}

function Hat2({ c }: { c: Costume }) { // Lab cap only — glasses are on face
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.labCapTop, { backgroundColor: c.hatColor }]} />
      <View style={[styles.labCapBrim, { backgroundColor: c.hatAccent }]} />
    </View>
  )
}

function Hat3({ c }: { c: Costume }) { // NASA full helmet — face drawn inside
  return (
    <View style={styles.hatWrap}>
      <View style={{ alignItems:'center' }}>
        {/* Dome — tall enough to contain the face */}
        <View style={{ width:32, height:38, borderRadius:16, backgroundColor:'#E8EEFF', borderWidth:2.5, borderColor:'#AABBDD', overflow:'hidden', alignItems:'center' }}>
          {/* Gold NASA band at top */}
          <View style={{ position:'absolute', top:4, left:0, right:0, height:4, backgroundColor:'#FFB800', opacity:0.5 }} />
          {/* Highlight */}
          <View style={{ position:'absolute', top:6, left:5, width:10, height:8, backgroundColor:'rgba(255,255,255,0.4)', borderRadius:5 }} />
          {/* Face visible through visor area */}
          <View style={{ position:'absolute', top:14, left:4, right:4, height:16, backgroundColor:'rgba(180,210,255,0.15)', borderRadius:5 }}>
            {/* Eyes */}
            <View style={{ flexDirection:'row', gap:5, justifyContent:'center', marginTop:3 }}>
              <View style={{ width:5, height:5, borderRadius:3, backgroundColor:'#3A2000' }} />
              <View style={{ width:5, height:5, borderRadius:3, backgroundColor:'#3A2000' }} />
            </View>
            {/* Moustache */}
            <View style={{ width:11, height:2.5, backgroundColor:'#3D2914', borderRadius:1, alignSelf:'center', marginTop:2 }} />
          </View>
          {/* Blue visor tint over face */}
          <View style={{ position:'absolute', top:14, left:4, right:4, height:16, backgroundColor:'#2244AA', opacity:0.22, borderRadius:5 }} />
          {/* Visor reflection */}
          <View style={{ position:'absolute', top:15, left:5, width:8, height:4, backgroundColor:'rgba(255,255,255,0.3)', borderRadius:3 }} />
        </View>
        {/* Collar ring */}
        <View style={{ width:30, height:6, backgroundColor:'#CCDDEE', borderRadius:3, borderWidth:1, borderColor:'#AABBCC' }} />
      </View>
    </View>
  )
}

function Hat4({ c }: { c: Costume }) { // Viking helmet + horns
  return (
    <View style={styles.hatWrap}>
      <View style={{ position:'absolute', left:-4, top:4, width:6, height:12, backgroundColor:'#D4C090', borderRadius:3, transform:[{rotate:'-15deg'}] }} />
      <View style={{ position:'absolute', right:-4, top:4, width:6, height:12, backgroundColor:'#D4C090', borderRadius:3, transform:[{rotate:'15deg'}] }} />
      <View style={[styles.vikingHelm, { backgroundColor: c.hatColor, borderColor: c.hatAccent }]}>
        <View style={[styles.vikingNoseGuard, { backgroundColor: c.hatAccent }]} />
      </View>
    </View>
  )
}

function Hat5({ c }: { c: Costume }) { // Safari pith helmet
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.safariTop, { backgroundColor: c.hatColor }]} />
      <View style={[styles.safariBrim, { backgroundColor: c.hatAccent }]} />
    </View>
  )
}

function Hat6({ c }: { c: Costume }) { // Diving helmet
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.diveHelm, { backgroundColor: c.hatColor, borderColor: '#555' }]}>
        <View style={[styles.divePorthole, { borderColor: c.detail }]} />
        <View style={[styles.diveValve, { backgroundColor: c.hatAccent }]} />
      </View>
    </View>
  )
}

function Hat7({ c }: { c: Costume }) { // Lava armor full helmet — face inside
  return (
    <View style={styles.hatWrap}>
      <View style={{ alignItems:'center' }}>
        {/* Top spike */}
        <View style={{ width:4, height:7, backgroundColor:'#FF4400', borderRadius:2, marginBottom:-2 }} />
        {/* Main helmet enclosing face */}
        <View style={{ width:30, height:38, backgroundColor:'#111111', borderRadius:5, borderWidth:2, borderColor:'#2A2A2A', alignItems:'center', overflow:'hidden' }}>
          {/* Top dome section */}
          <View style={{ position:'absolute', top:0, left:0, right:0, height:12, backgroundColor:'#1A1A1A', borderTopLeftRadius:5, borderTopRightRadius:5 }}>
            <View style={{ position:'absolute', top:3, left:0, right:0, height:2, backgroundColor:'#FF4400', opacity:0.35 }} />
          </View>
          {/* Face inside — visible through visor slit */}
          <View style={{ position:'absolute', top:14, left:4, right:4, height:14, backgroundColor:'rgba(30,10,5,0.6)', borderRadius:2 }}>
            {/* Eyes glowing through visor */}
            <View style={{ flexDirection:'row', gap:4, justifyContent:'center', marginTop:3 }}>
              <View style={{ width:5, height:4, borderRadius:2, backgroundColor:'#FF6600', opacity:0.8 }} />
              <View style={{ width:5, height:4, borderRadius:2, backgroundColor:'#FF6600', opacity:0.8 }} />
            </View>
            <View style={{ width:10, height:2, backgroundColor:'#3D2914', borderRadius:1, alignSelf:'center', marginTop:2 }} />
          </View>
          {/* Orange visor slit overlay */}
          <View style={{ position:'absolute', top:14, left:4, right:4, height:14, backgroundColor:'#FF4400', opacity:0.18, borderRadius:2 }} />
          {/* Visor frame */}
          <View style={{ position:'absolute', top:13, left:3, right:3, height:16, borderWidth:1.5, borderColor:'#FF4400', borderRadius:3, opacity:0.7 }} />
          {/* Vent slots bottom */}
          {[0,1,2].map(i=>(
            <View key={i} style={{ position:'absolute', bottom:4, left:5+i*7, width:4, height:3, backgroundColor:'#333', borderRadius:1 }} />
          ))}
          {/* Side armor detail */}
          <View style={{ position:'absolute', left:0, top:8, bottom:8, width:3, backgroundColor:'#FF4400', opacity:0.25 }} />
          <View style={{ position:'absolute', right:0, top:8, bottom:8, width:3, backgroundColor:'#FF4400', opacity:0.25 }} />
        </View>
        {/* Chin guard / neck seal */}
        <View style={{ width:28, height:5, backgroundColor:'#1A1A1A', borderRadius:2, borderWidth:1, borderColor:'#333', marginTop:-1 }} />
      </View>
    </View>
  )
}

function Hat8({ c }: { c: Costume }) { // Explorer fedora
  return (
    <View style={styles.hatWrap}>
      <View style={[styles.fedoraTop, { backgroundColor: c.hatColor }]} />
      <View style={[styles.fedoraBrim, { backgroundColor: c.hatAccent }]} />
      <View style={[styles.fedoraBand, { backgroundColor: '#2A1A08' }]} />
    </View>
  )
}

function Hat9({ c }: { c: Costume }) { // Cyberpunk visor + antenna spike
  return (
    <View style={styles.hatWrap}>
      <View style={{ alignItems:'center' }}>
        <View style={[styles.cyberSpike, { backgroundColor: c.detail }]} />
        <View style={[styles.cyberCap, { backgroundColor: c.hatColor }]}>
          <View style={[styles.cyberVisorBar, { backgroundColor: c.detail }]} />
        </View>
      </View>
    </View>
  )
}

const HAT_COMPONENTS = [Hat0, Hat1, Hat2, Hat3, Hat4, Hat5, Hat6, Hat7, Hat8, Hat9]

function WorldHat({ worldId, costume }: { worldId: number; costume: Costume }) {
  const HatComp = HAT_COMPONENTS[worldId] ?? Hat0
  return <HatComp c={costume} />
}

// ── Standing Bosse ────────────────────────────────────────────────────────────
function BosseStanding({ tapping, scale, worldId }: { tapping: boolean; scale: number; worldId: number }) {
  const bounce   = useRef(new Animated.Value(0)).current
  const bob      = useRef(new Animated.Value(0)).current
  const armAngle = useRef(new Animated.Value(-20)).current
  const eyeScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!tapping) return
    Animated.sequence([
      Animated.timing(bounce, { toValue: -7, duration: 65, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0,  duration: 65, useNativeDriver: true }),
    ]).start()
  }, [tapping])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -2, duration: 900, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0,  duration: 900, useNativeDriver: true }),
    ])).start()
  }, [])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(3200),
      Animated.timing(armAngle, { toValue: -58, duration: 240, useNativeDriver: true }),
      Animated.timing(armAngle, { toValue: -25, duration: 200, useNativeDriver: true }),
      Animated.timing(armAngle, { toValue: -55, duration: 200, useNativeDriver: true }),
      Animated.timing(armAngle, { toValue: -20, duration: 260, useNativeDriver: true }),
    ])).start()
  }, [])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(2600),
      Animated.timing(eyeScale, { toValue: 0.08, duration: 70, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
      Animated.delay(150),
      Animated.timing(eyeScale, { toValue: 0.08, duration: 70, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ])).start()
  }, [])

  const armDeg = armAngle.interpolate({ inputRange: [-90, 0], outputRange: ['-90deg', '0deg'] })
  const c = COSTUMES[worldId] ?? COSTUMES[0]

  return (
    <Animated.View style={[styles.standing, {
      transform: [{ translateY: Animated.add(bounce, bob) }, { scale }],
    }]}>
      <WorldHat worldId={worldId} costume={c} />
      {/* Head — hidden for worlds 3+7 (face drawn inside helmet) */}
      {worldId !== 3 && worldId !== 7 && (
        <View style={[styles.head]}>
          <View style={styles.eyeRow}>
            <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
            <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeScale }] }]} />
          </View>
          <View style={styles.moustache} />
          <View style={styles.mouth} />
          {/* World 2: big circular glasses ON the face, over the eyes */}
          {worldId === 2 && (
            <View style={styles.labGlassesOnFace}>
              <View style={styles.labLens}><View style={styles.labLensGlass} /></View>
              <View style={styles.labBridge} />
              <View style={styles.labLens}><View style={styles.labLensGlass} /></View>
            </View>
          )}
          {/* World 9: cyber implant */}
          {worldId === 9 && <View style={[styles.cyberDot, { backgroundColor: c.detail }]} />}
        </View>
      )}
      {/* Neck — hidden for world 3+7 (suit covers it) */}
      {worldId !== 3 && worldId !== 7
        ? <View style={[styles.neck, { backgroundColor: SKIN }]} />
        : <View style={[styles.neck, { backgroundColor: worldId === 7 ? '#111' : '#CCDDEE' }]} />
      }
      {/* Body */}
      <View style={[styles.body, { backgroundColor: c.overalls }]}>
        <View style={[styles.bib, { backgroundColor: c.bib }]} />
        <View style={[styles.strapL, { backgroundColor: c.strap }]} />
        <View style={[styles.strapR, { backgroundColor: c.strap }]} />
        {/* World-specific body badge */}
        {c.detail && worldId >= 1 && (
          <View style={[styles.bodyBadge, { backgroundColor: c.detail }]} />
        )}
      </View>
      {/* Scuba tank on back (world 6) */}
      {worldId === 6 && (
        <View style={{ position:'absolute', top:38, left:-5, width:9, height:22, backgroundColor:'#334455', borderRadius:4, borderWidth:1, borderColor:'#556677' }}>
          <View style={{ position:'absolute', top:-3, left:1, width:7, height:5, backgroundColor:'#667788', borderRadius:2 }} />
          <View style={{ position:'absolute', top:5,  left:2, right:1, height:2, backgroundColor:'#778899', borderRadius:1, opacity:0.6 }} />
          <View style={{ position:'absolute', top:11, left:2, right:1, height:2, backgroundColor:'#778899', borderRadius:1, opacity:0.6 }} />
        </View>
      )}
      <View style={[styles.armL, { backgroundColor: SKIN }]} />
      <Animated.View style={[styles.armR, { backgroundColor: SKIN, transform: [{ rotate: armDeg }] }]} />
      <View style={styles.legsRow}>
        <View style={[styles.leg, { backgroundColor: c.overalls }]}>
          <View style={[styles.boot, { backgroundColor: BROWN }]} />
        </View>
        <View style={[styles.leg, { backgroundColor: c.overalls }]}>
          <View style={[styles.boot, { backgroundColor: BROWN }]} />
        </View>
      </View>
    </Animated.View>
  )
}

// ── Relaxing Bosse ────────────────────────────────────────────────────────────
function BosseRelaxing({ scale, worldId }: { scale: number; worldId: number }) {
  const steam    = useRef(new Animated.Value(0)).current
  const steamOp  = useRef(new Animated.Value(0)).current
  const sipY     = useRef(new Animated.Value(0)).current
  const breathY  = useRef(new Animated.Value(0)).current
  const eyeScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(steam,   { toValue: -16, duration: 1200, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(steamOp, { toValue: 0.8, duration: 400,  useNativeDriver: true }),
          Animated.timing(steamOp, { toValue: 0,   duration: 800,  useNativeDriver: true }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(steam,   { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(steamOp, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ])).start()
  }, [])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(4000),
      Animated.timing(sipY, { toValue: -10, duration: 380, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(sipY, { toValue: 0,   duration: 300, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(sipY, { toValue: -10, duration: 340, useNativeDriver: true }),
      Animated.delay(400),
      Animated.timing(sipY, { toValue: 0,   duration: 300, useNativeDriver: true }),
    ])).start()
  }, [])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(breathY, { toValue: -1.5, duration: 1000, useNativeDriver: true }),
      Animated.timing(breathY, { toValue: 0,    duration: 1000, useNativeDriver: true }),
    ])).start()
  }, [])

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(3800),
      Animated.timing(eyeScale, { toValue: 0.08, duration: 70, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ])).start()
  }, [])

  const c = COSTUMES[worldId] ?? COSTUMES[0]

  return (
    <View style={[styles.relaxWrap, { transform: [{ scale }] }]}>
      <View style={styles.chair}>
        <View style={styles.chairBack} />
        <View style={styles.chairSeat} />
        <View style={styles.chairLegL} />
        <View style={styles.chairLegR} />
      </View>
      <Animated.View style={[styles.sittingBosse, { transform: [{ translateY: breathY }] }]}>
        {/* Small hat matching world */}
        <View style={styles.hatSmallWrap}>
          <SmallHat worldId={worldId} c={c} />
        </View>
        <View style={styles.headSmall}>
          <View style={styles.eyeRowSmall}>
            <Animated.View style={[styles.eyeSmall, { transform: [{ scaleY: eyeScale }] }]} />
            <Animated.View style={[styles.eyeSmall, { transform: [{ scaleY: eyeScale }] }]} />
          </View>
          <View style={styles.happyMouth} />
        </View>
        <View style={[styles.sittingBody, { backgroundColor: c.overalls }]}>
          <View style={[styles.sittingBib, { backgroundColor: c.bib }]} />
        </View>
        <Animated.View style={[styles.coffeeArm, { transform: [{ translateY: sipY }] }]}>
          <View style={styles.cup}>
            <View style={styles.cupBody} />
            <View style={styles.cupHandle} />
            <View style={styles.cupSaucer} />
            <Animated.View style={[styles.cupSteam, { opacity: steamOp, transform: [{ translateY: steam }] }]} />
            <Animated.View style={[styles.cupSteam, { opacity: steamOp, left: 10, transform: [{ translateY: steam }, { translateX: 3 }] }]} />
          </View>
        </Animated.View>
        <View style={styles.sittingLegs}>
          <View style={[styles.sittingLeg, { backgroundColor: c.overalls }]} />
          <View style={[styles.sittingLeg, { backgroundColor: c.overalls }]} />
        </View>
      </Animated.View>
    </View>
  )
}

// Small hat variant for relaxing Bosse
function SmallHat({ worldId, c }: { worldId: number; c: Costume }) {
  if (worldId === 4) return ( // Viking small horns
    <View style={{ alignItems:'center' }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', width:22 }}>
        <View style={{ width:4, height:7, backgroundColor:'#D4C090', borderRadius:2, transform:[{rotate:'-15deg'}] }} />
        <View style={{ width:4, height:7, backgroundColor:'#D4C090', borderRadius:2, transform:[{rotate:'15deg'}] }} />
      </View>
      <View style={[styles.hatSmallTop, { backgroundColor: c.hatColor, marginTop:-2 }]} />
    </View>
  )
  if (worldId === 3) return ( // Space small dome
    <View style={[styles.spaceDomeSmall, { backgroundColor: c.hatColor, borderColor: c.hatAccent }]} />
  )
  if (worldId === 8) return ( // Wide fedora
    <View style={{ alignItems:'center' }}>
      <View style={[styles.hatSmallTop, { backgroundColor: c.hatColor, width:16 }]} />
      <View style={[styles.hatSmallBrim, { backgroundColor: c.hatAccent, width:24 }]} />
    </View>
  )
  if (worldId === 5) return ( // Safari
    <View style={{ alignItems:'center' }}>
      <View style={[styles.hatSmallTop, { backgroundColor: c.hatColor }]} />
      <View style={[styles.hatSmallBrim, { backgroundColor: c.hatAccent, width:22 }]} />
    </View>
  )
  if (worldId === 9) return ( // Cyber
    <View style={{ alignItems:'center' }}>
      <View style={{ width:2, height:6, backgroundColor: c.detail, borderRadius:1 }} />
      <View style={[styles.hatSmallTop, { backgroundColor: c.hatColor }]}>
        <View style={{ position:'absolute', top:2, left:2, right:2, height:2, backgroundColor: c.detail }} />
      </View>
    </View>
  )
  // Default: hard hat style
  return (
    <View style={{ alignItems:'center' }}>
      <View style={[styles.hatSmallTop, { backgroundColor: c.hatColor }]} />
      <View style={[styles.hatSmallBrim, { backgroundColor: c.hatAccent }]} />
    </View>
  )
}

// ── Dancing Bosse (cyberpunk world, max upgrade) ──────────────────────────────
function BosseDancing({ scale }: { scale: number }) {
  const bounce  = useRef(new Animated.Value(0)).current
  const armL    = useRef(new Animated.Value(-20)).current
  const armR    = useRef(new Animated.Value(-20)).current
  const hatBob  = useRef(new Animated.Value(0)).current
  const legL    = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: -10, duration: 180, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0,   duration: 180, useNativeDriver: true }),
    ])).start()
    Animated.loop(Animated.sequence([
      Animated.timing(armL, { toValue: -75, duration: 240, useNativeDriver: true }),
      Animated.timing(armL, { toValue: -20, duration: 240, useNativeDriver: true }),
    ])).start()
    Animated.loop(Animated.sequence([
      Animated.delay(240),
      Animated.timing(armR, { toValue: -75, duration: 240, useNativeDriver: true }),
      Animated.timing(armR, { toValue: -20, duration: 240, useNativeDriver: true }),
    ])).start()
    Animated.loop(Animated.sequence([
      Animated.timing(hatBob, { toValue: 4,  duration: 180, useNativeDriver: true }),
      Animated.timing(hatBob, { toValue: -4, duration: 180, useNativeDriver: true }),
    ])).start()
    Animated.loop(Animated.sequence([
      Animated.timing(legL, { toValue: 14, duration: 200, useNativeDriver: true }),
      Animated.timing(legL, { toValue: 0,  duration: 200, useNativeDriver: true }),
    ])).start()
  }, [])

  const armLDeg = armL.interpolate({ inputRange: [-90, 0], outputRange: ['-90deg', '0deg'] })
  const armRDeg = armR.interpolate({ inputRange: [-90, 0], outputRange: ['-90deg', '0deg'] })
  const legLDeg = legL.interpolate({ inputRange: [0, 14], outputRange: ['0deg', '25deg'] })
  const c = COSTUMES[9]

  return (
    <Animated.View style={[styles.standing, { transform: [{ translateY: bounce }, { scale }] }]}>
      {/* Party hat */}
      <Animated.View style={{ alignItems:'center', transform:[{ translateX: hatBob }] }}>
        <View style={{ width:4, height:4, borderRadius:2, backgroundColor:'#FFFF00', marginBottom:-2 }} />
        <View style={{ width:0, height:0, borderLeftWidth:12, borderRightWidth:12, borderBottomWidth:22,
          borderLeftColor:'transparent', borderRightColor:'transparent', borderBottomColor:'#FF00CC' }}>
        </View>
        <View style={{ position:'absolute', bottom:7, left:-9, right:-9, height:2, backgroundColor:'#FFFF00', borderRadius:1 }} />
        <View style={{ position:'absolute', bottom:3, left:-11, right:-11, height:2, backgroundColor:'#00FFCC', borderRadius:1 }} />
        <View style={{ width:24, height:4, backgroundColor:'#FF00CC', borderRadius:2, marginTop:-1 }} />
      </Animated.View>
      {/* Head */}
      <View style={styles.head}>
        <View style={styles.eyeRow}>
          <View style={[styles.eye, { backgroundColor:'#FF00CC' }]} />
          <View style={[styles.eye, { backgroundColor:'#00FFCC' }]} />
        </View>
        <View style={styles.moustache} />
        <View style={{ width:14, height:3, backgroundColor:'#FF8800', borderRadius:2 }} />
      </View>
      <View style={styles.neck} />
      {/* Body */}
      <View style={[styles.body, { backgroundColor:c.overalls }]}>
        <View style={[styles.bib, { backgroundColor:c.bib }]} />
        <View style={[styles.strapL, { backgroundColor:c.strap }]} />
        <View style={[styles.strapR, { backgroundColor:c.strap }]} />
        <View style={[styles.bodyBadge, { backgroundColor:c.detail }]} />
      </View>
      {/* Arms waving */}
      <Animated.View style={[styles.armL, { backgroundColor:SKIN, transform:[{ rotate:armLDeg }] }]} />
      <Animated.View style={[styles.armR, { backgroundColor:SKIN, transform:[{ rotate:armRDeg }] }]} />
      {/* Legs shuffle */}
      <View style={styles.legsRow}>
        <Animated.View style={[styles.leg, { backgroundColor:c.overalls, transform:[{ rotate:legLDeg }] }]}>
          <View style={[styles.boot, { backgroundColor:BROWN }]} />
        </Animated.View>
        <Animated.View style={[styles.leg, { backgroundColor:c.overalls, transform:[{ rotate: legL.interpolate({ inputRange:[0,14], outputRange:['0deg','-25deg'] }) }] }]}>
          <View style={[styles.boot, { backgroundColor:BROWN }]} />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export default function BosseCharacter({ tapping = false, size = 42, relaxing = false, worldId = 0 }: Props) {
  const scale = size / 42
  const wid = Math.min(worldId, 9)
  if (relaxing && wid === 9) return <BosseDancing scale={scale} />
  if (relaxing) return <BosseRelaxing scale={scale} worldId={wid} />
  return <BosseStanding tapping={tapping} scale={scale} worldId={wid} />
}

const styles = StyleSheet.create({
  // ── Standing ──
  standing: { alignItems: 'center', width: 42 },
  hatWrap: { alignItems: 'center', position: 'relative' },

  // World 0/1: hard hat
  hatBrim: { width: 30, height: 4, borderRadius: 2 },
  hatTop:  { width: 22, height: 8, borderRadius: 2, marginTop: -2, alignItems: 'center', overflow: 'hidden' },

  // World 2: lab cap + big glasses
  labCapBrim: { width: 26, height: 3, borderRadius: 1 },
  labCapTop:  { width: 18, height: 7, borderRadius: 4 },
  labGlassesRow: { flexDirection:'row', alignItems:'center', marginTop:1 },
  labGlassesOnFace: { position:'absolute', top:2, flexDirection:'row', alignItems:'center', alignSelf:'center' },
  labLens: { width:10, height:10, borderRadius:5, borderWidth:2, backgroundColor:'rgba(180,240,255,0.18)' },
  labLensGlass: { position:'absolute', top:1, left:1, width:4, height:4, borderRadius:2, backgroundColor:'rgba(255,255,255,0.35)' },
  labBridge: { width:4, height:1.5, backgroundColor:'#555' },
  labGlasses: { position:'absolute', bottom:3, left:3, right:3, height:2, backgroundColor:'rgba(150,200,255,0.5)', borderRadius:1 },

  // World 3: space dome
  spaceDome: { width: 28, height: 18, borderRadius: 14, borderWidth: 2, alignItems:'center', justifyContent:'center' },
  spaceVisor: { width: 16, height: 8, backgroundColor: 'rgba(100,180,255,0.35)', borderRadius: 4 },
  spaceDomeSmall: { width:18, height:12, borderRadius:9, borderWidth:1.5 },

  // World 4: viking helm
  vikingHelm: { width: 24, height: 14, borderRadius: 4, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, borderWidth: 1, alignItems:'center' },
  vikingNoseGuard: { position:'absolute', bottom:-2, width:4, height:8, borderRadius:1 },

  // World 5: safari
  safariTop:  { width: 20, height: 10, borderRadius: 4 },
  safariBrim: { width: 36, height: 3, borderRadius: 1, marginTop: -1 },

  // World 6: diving helmet
  diveHelm:     { width: 26, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems:'center', justifyContent:'center' },
  divePorthole: { width: 14, height: 10, borderRadius: 3, borderWidth: 2, backgroundColor:'rgba(0,180,255,0.2)' },
  diveValve:    { position:'absolute', top:-2, right:4, width:6, height:4, borderRadius:2 },

  // World 7: fire helmet
  fireHelmTop:  { width: 22, height: 12, borderRadius: 4, borderTopLeftRadius:6, borderTopRightRadius:6 },
  fireHelmBrim: { width: 28, height: 3, borderRadius: 1, marginTop: -1 },
  fireHelmVisor:{ position:'absolute', bottom:0, width:16, height:4, borderRadius:2 },

  // World 8: fedora
  fedoraTop:  { width: 18, height: 10, borderRadius: 3 },
  fedoraBrim: { width: 38, height: 3, borderRadius: 1, marginTop: -1 },
  fedoraBand: { position:'absolute', bottom:3, width:18, height:2 },

  // World 9: cyberpunk
  cyberSpike: { width: 2, height: 8, borderRadius: 1 },
  cyberCap:   { width: 24, height: 8, borderRadius: 3, alignItems:'center', justifyContent:'center' },
  cyberVisorBar: { width: 18, height: 3, borderRadius: 1 },
  cyberDot:   { position:'absolute', top:2, right:2, width:3, height:3, borderRadius:2 },

  // Head
  head: {
    width: 22, height: 20, backgroundColor: SKIN,
    borderRadius: 3, alignItems: 'center', paddingTop: 4,
  },
  headSpace: { borderRadius: 8 }, // slightly rounder for space theme
  eyeRow: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  eye:  { width: 5, height: 5, borderRadius: 3, backgroundColor: '#3A2000' },
  moustache: { width: 12, height: 3, backgroundColor: BROWN, borderRadius: 1, marginBottom: 1 },
  mouth: { width: 10, height: 2, backgroundColor: BROWN, borderRadius: 1 },

  // Body
  neck: { width: 8, height: 4, backgroundColor: SKIN },
  body: { width: 26, height: 20, borderRadius: 2, position: 'relative', alignItems: 'center' },
  bib:   { width: 12, height: 10, borderRadius: 1, marginTop: 2 },
  strapL: { position:'absolute', top:0, left:6,  width:4, height:4 },
  strapR: { position:'absolute', top:0, right:6, width:4, height:4 },
  bodyBadge: { position:'absolute', bottom:3, right:4, width:5, height:5, borderRadius:3 },

  // Arms / Legs
  armL:  { position:'absolute', top:44, left:2,  width:8, height:16, backgroundColor:SKIN, borderRadius:3 },
  armR:  { position:'absolute', top:44, right:0, width:8, height:16, backgroundColor:SKIN, borderRadius:3 },
  legsRow: { flexDirection:'row', gap:4, marginTop:1 },
  leg:  { width:10, height:14, borderRadius:2, alignItems:'center', justifyContent:'flex-end', paddingBottom:1 },
  boot: { width:12, height:5, borderRadius:2 },

  // ── Relaxing ──
  relaxWrap:   { flexDirection:'row', alignItems:'flex-end', width:68 },
  chair:       { position:'absolute', bottom:0, left:0, width:50, height:48 },
  chairBack:   { position:'absolute', right:0, top:0, width:10, height:42, backgroundColor:'#5A3A14', borderRadius:2 },
  chairSeat:   { position:'absolute', bottom:14, left:0, right:0, height:10, backgroundColor:'#5A3A14', borderRadius:2 },
  chairLegL:   { position:'absolute', bottom:0, left:4,  width:6, height:15, backgroundColor:BROWN, borderRadius:1 },
  chairLegR:   { position:'absolute', bottom:0, right:8, width:6, height:15, backgroundColor:BROWN, borderRadius:1 },

  sittingBosse: { position:'absolute', bottom:14, left:0, width:50, alignItems:'center' },
  hatSmallWrap: { alignItems:'center' },
  hatSmallBrim: { width:20, height:3, borderRadius:1, backgroundColor:'#FFB800' },
  hatSmallTop:  { width:14, height:6, borderRadius:2, marginTop:-1, backgroundColor:'#FFB800' },
  headSmall: {
    width:18, height:16, backgroundColor:SKIN, borderRadius:3,
    alignItems:'center', paddingTop:3,
  },
  eyeRowSmall: { flexDirection:'row', gap:4, marginBottom:2 },
  eyeSmall:    { width:4, height:3, borderRadius:2, backgroundColor:'#3A2000' },
  happyMouth:  { width:8, height:2, backgroundColor:BROWN, borderRadius:2 },
  sittingBody: { width:24, height:16, borderRadius:2, alignItems:'center', paddingTop:2 },
  sittingBib:  { width:10, height:8, borderRadius:1 },
  coffeeArm:   { position:'absolute', right:-16, top:16 },
  cup:         { position:'relative', width:24, height:20 },
  cupBody:     { width:16, height:14, backgroundColor:'#FAFAFA', borderRadius:3, borderWidth:1, borderColor:'#DDD', marginLeft:2 },
  cupHandle:   { position:'absolute', right:0, top:3, width:6, height:8, borderWidth:2, borderColor:'#DDD', borderRadius:3, backgroundColor:'transparent' },
  cupSaucer:   { width:20, height:3, backgroundColor:'#FAFAFA', borderRadius:2, borderWidth:1, borderColor:'#DDD' },
  cupSteam:    { position:'absolute', top:-8, left:6, width:4, height:8, borderRadius:2, backgroundColor:'#CCCCCC' },
  sittingLegs: { flexDirection:'row', gap:3, marginTop:1 },
  sittingLeg:  { width:10, height:8, borderRadius:2 },
})
