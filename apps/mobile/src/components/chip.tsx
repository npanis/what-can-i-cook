import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface ChipProps {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  accessibilityLabel?: string;
}

export function Chip({ label, onPress, variant = 'filled', accessibilityLabel }: ChipProps) {
  const filled = variant === 'filled';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.chip, filled ? styles.filled : styles.outline, pressed && styles.pressed]}>
      <ThemedText type="smallBold" style={{ color: filled ? Colors.background : Colors.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.chip,
  },
  filled: { backgroundColor: Colors.accent },
  outline: { borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  pressed: { opacity: 0.7 },
});
