import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** primary: the screen's main action. dark: a compact secondary action, like Add. */
  variant?: 'primary' | 'dark';
  icon?: ReactNode;
  accessibilityHint?: string;
}

export function Button({ label, onPress, disabled, variant = 'primary', icon, accessibilityHint }: ButtonProps) {
  const dark = variant === 'dark';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        dark ? styles.dark : styles.primary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <ThemedText style={dark ? styles.darkLabel : styles.primaryLabel}>{label}</ThemedText>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primary: { height: 56, borderRadius: Radius.button, backgroundColor: Colors.accent },
  dark: { height: 48, paddingHorizontal: 18, borderRadius: Radius.input, backgroundColor: Colors.ink },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
  primaryLabel: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.surface },
  darkLabel: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.surface },
});
