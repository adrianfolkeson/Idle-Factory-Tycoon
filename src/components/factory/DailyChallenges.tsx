import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from '../../constants/colors'
import PixelIcon from '../ui/PixelIcon'
import { formatMoney } from '../../lib/formatting'
import { useGame } from '../../context/GameContext'

interface Challenge {
  id: number; icon: string; type: 'taps'|'earn'|'upgrades'
  desc: string; target: number; reward: number
}

function seed(world: number): Challenge[] {
  const w = Math.max(1, world)
  return [
    { id:0, icon:'hand', type:'taps',
      desc:`Klicka ${100 * w * 2} gånger`,
      target: 100 * w * 2,
      reward: Math.ceil(200 * Math.pow(8, world * 0.8)) },
    { id:1, icon:'coin', type:'earn',
      desc:`Tjäna ${formatMoney(Math.ceil(1000 * Math.pow(8, world * 1.1)))}`,
      target: Math.ceil(1000 * Math.pow(8, world * 1.1)),
      reward: Math.ceil(500 * Math.pow(8, world * 0.9)) },
    { id:2, icon:'gear', type:'upgrades',
      desc:`Köp ${4 + world} uppgraderingar`,
      target: 4 + world,
      reward: Math.ceil(800 * Math.pow(8, world * 0.85)) },
  ]
}

const todayKey = () => {
  const d = new Date()
  return `dc_${d.getFullYear()}_${String(d.getMonth()).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`
}

export default function DailyChallenges({ accent }: { accent: string }) {
  const { state, dispatch } = useGame()
  const [open, setOpen] = useState(false)
  const [claimed, setClaimed] = useState([false,false,false])
  const base = useRef({
    taps: state.stats.totalTaps,
    upgrades: state.stats.totalUpgradesPurchased,
    earned: state.totalEarned,
  })
  const anim = useRef(new Animated.Value(0)).current

  const challenges = seed(state.currentWorldId)

  const prog = {
    taps: Math.max(0, state.stats.totalTaps - base.current.taps),
    upgrades: Math.max(0, state.stats.totalUpgradesPurchased - base.current.upgrades),
    earned: Math.max(0, state.totalEarned - base.current.earned),
  }

  const getP = (i: number) => i===0 ? prog.taps : i===1 ? prog.earned : prog.upgrades

  useEffect(() => {
    AsyncStorage.getItem(todayKey()).then(r => {
      if (r) setClaimed(JSON.parse(r).claimed ?? [false,false,false])
    })
  }, [])

  const toggle = () => {
    const to = open ? 0 : 1
    setOpen(!open)
    Animated.timing(anim, { toValue:to, duration:220, useNativeDriver:false }).start()
  }

  const claim = async (i: number) => {
    const p = getP(i); const ch = challenges[i]
    if (p < ch.target || claimed[i]) return
    const nc = [...claimed]; nc[i] = true
    setClaimed(nc)
    dispatch({ type:'TAP', clickValue: ch.reward })
    await AsyncStorage.setItem(todayKey(), JSON.stringify({ claimed:nc }))
  }

  const done = challenges.filter((_,i) => getP(i) >= challenges[i].target).length
  const h = anim.interpolate({ inputRange:[0,1], outputRange:[0, challenges.length*64+8] })

  return (
    <View style={[styles.wrap, { borderColor: accent+'55' }]}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.8}>
        <View style={styles.row}>
          <PixelIcon name="star" size={11} color={accent} />
          <Text style={[styles.title, { color:accent }]}>DAGENS UTMANINGAR</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.counter}>{done}/3</Text>
          <Text style={[styles.chev, { color:accent }]}>{open?'▲':'▼'}</Text>
        </View>
      </TouchableOpacity>
      <Animated.View style={{ height:h, overflow:'hidden' }}>
        {challenges.map((ch, i) => {
          const p   = getP(i)
          const pct = Math.min(1, p / ch.target)
          const isDone = p >= ch.target
          return (
            <View key={ch.id} style={styles.item}>
              <PixelIcon name={ch.icon} size={11} color={isDone ? COLORS.greenLight : COLORS.greyDark} />
              <View style={styles.info}>
                <Text style={[styles.desc, isDone && { color:COLORS.greenLight }]} numberOfLines={1}>
                  {ch.desc}
                </Text>
                <View style={styles.barBg}>
                  <View style={[styles.bar, { width:`${pct*100}%` as any,
                    backgroundColor: isDone ? COLORS.greenLight : accent }]} />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => claim(i)}
                disabled={!isDone || claimed[i]}
                style={[styles.btn,
                  !isDone && styles.btnLocked,
                  claimed[i] && styles.btnClaimed,
                  isDone && !claimed[i] && { borderColor:COLORS.greenLight },
                ]}>
                <Text style={[styles.btnTxt,
                  claimed[i] && { color:COLORS.greyDark },
                  isDone && !claimed[i] && { color:COLORS.greenLight },
                ]}>
                  {claimed[i] ? '✓' : formatMoney(ch.reward)}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderWidth:1, borderRadius:10, backgroundColor:'#080808',
    marginHorizontal:12, marginBottom:6, overflow:'hidden' },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:12, paddingVertical:8 },
  row: { flexDirection:'row', alignItems:'center', gap:7 },
  title: { fontSize:10, fontFamily:'Courier New', fontWeight:'bold', letterSpacing:1 },
  counter: { fontSize:11, fontFamily:'Courier New', color:COLORS.grey },
  chev: { fontSize:10 },
  item: { flexDirection:'row', alignItems:'center', gap:8,
    paddingHorizontal:12, paddingVertical:7,
    borderTopWidth:1, borderTopColor:COLORS.border },
  info: { flex:1, gap:4 },
  desc: { fontSize:10, fontFamily:'Courier New', color:COLORS.grey },
  barBg: { height:3, backgroundColor:COLORS.border, borderRadius:2, overflow:'hidden' },
  bar: { height:'100%', borderRadius:2 },
  btn: { paddingHorizontal:7, paddingVertical:4, borderWidth:1,
    borderRadius:4, borderColor:COLORS.border, minWidth:42, alignItems:'center' },
  btnLocked: { opacity:0.35 },
  btnClaimed: { borderColor:COLORS.greyDark, backgroundColor:COLORS.border },
  btnTxt: { fontSize:9, fontFamily:'Courier New', fontWeight:'bold', color:COLORS.greyDark },
})
