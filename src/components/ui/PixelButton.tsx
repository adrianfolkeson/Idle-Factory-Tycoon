import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { COLORS } from '../../constants/colors'

interface Props {
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  style?: ViewStyle
  small?: boolean
}

export default function PixelButton({ label, onPress, disabled, variant = 'primary', style, small }: Props) {
  const bgColor = disabled
    ? COLORS.disabled
    : variant === 'danger'
    ? COLORS.red
    : variant === 'secondary'
    ? COLORS.surface
    : COLORS.green

  const borderColor = disabled
    ? COLORS.greyDark
    : variant === 'danger'
    ? COLORS.redLight
    : variant === 'secondary'
    ? COLORS.border
    : '#4A8A3A'

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor, borderColor },
        small && styles.small,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled, small && styles.labelSmall]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    borderRadius: 4,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  labelDisabled: {
    color: COLORS.disabledText,
  },
  labelSmall: {
    fontSize: 11,
  },
})
