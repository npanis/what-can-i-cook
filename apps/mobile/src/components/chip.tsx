import { Pressable, StyleSheet, View } from 'react-native';

import { CloseIcon, PlusIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

/** A pantry item with a remove button. */
export function PantryChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={[styles.chip, styles.pantry]}>
      <ThemedText style={styles.pantryLabel}>{label}</ThemedText>
      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label}`}
        hitSlop={6}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
        <CloseIcon color={Colors.textSecondary} />
      </Pressable>
    </View>
  );
}

/** A dashed suggestion that adds an item when tapped. */
export function AddChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Add ${label}`}
      style={({ pressed }) => [styles.chip, styles.add, pressed && styles.pressed]}>
      <PlusIcon color={Colors.text} />
      <ThemedText style={styles.addLabel}>{label}</ThemedText>
    </Pressable>
  );
}

/** A small read-only tag: green for what you have, amber for what you need. */
export function Tag({ label, tone }: { label: string; tone: 'have' | 'need' }) {
  const need = tone === 'need';
  return (
    <View style={[styles.tag, { backgroundColor: need ? Colors.warnSoft : Colors.accentSoft }]}>
      <ThemedText style={[styles.tagLabel, { color: need ? Colors.warnText : Colors.accentText }]}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', height: 44, borderRadius: 22, borderWidth: 1.5 },
  pantry: {
    gap: Spacing.one,
    paddingLeft: 14,
    paddingRight: 6,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  pantryLabel: { fontFamily: Fonts.semibold, fontSize: 15 },
  remove: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  add: { gap: 6, paddingHorizontal: 14, borderStyle: 'dashed', borderColor: Colors.borderDashed },
  addLabel: { fontSize: 15 },
  tag: { paddingHorizontal: 10, paddingVertical: Spacing.one, borderRadius: Radius.input },
  tagLabel: { fontFamily: Fonts.semibold, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.6 },
});
