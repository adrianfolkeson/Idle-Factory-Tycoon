import React from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { formatMoney } from '../../lib/formatting'
import { COLORS } from '../../constants/colors'

interface Props {
  amount: number
  onDismiss: () => void
}

export default function OfflineEarningsModal({ amount, onDismiss }: Props) {
  if (amount <= 0) return null

  return (
    <Modal transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.robot}>🤖</Text>
          <Text style={styles.title}>BUSSE jobbade!</Text>
          <Text style={styles.subtitle}>Medan du var borta producerade fabriken:</Text>
          <Text style={styles.amount}>{formatMoney(amount)}</Text>
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>TACK BUSSE!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 3,
    borderColor: COLORS.gold,
    borderRadius: 8,
    padding: 28,
    alignItems: 'center',
    width: 280,
  },
  robot: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: 22,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: COLORS.goldLight,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#4A8A3A',
    borderRadius: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
})
