import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MinusIcon, PlusLargeIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { peopleLabel } from '@/lib/labels';

export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 6;

export function ServingsStepper({ people, onChange }: { people: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.text}>
        <ThemedText style={styles.title}>Cooking for</ThemedText>
        <ThemedText type="label" themeColor="textSecondary" style={styles.sub}>
          Amounts update to match
        </ThemedText>
      </View>
      <View style={styles.controls} accessibilityRole="adjustable" accessibilityValue={{ text: peopleLabel(people) }}>
        <RoundButton label="Fewer people" disabled={people <= MIN_PEOPLE} onPress={() => onChange(people - 1)}>
          <MinusIcon color={Colors.text} />
        </RoundButton>
        <ThemedText style={styles.value}>{peopleLabel(people)}</ThemedText>
        <RoundButton label="More people" disabled={people >= MAX_PEOPLE} onPress={() => onChange(people + 1)}>
          <PlusLargeIcon color={Colors.text} />
        </RoundButton>
      </View>
    </View>
  );
}

function RoundButton(props: { label: string; disabled: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled: props.disabled }}
      style={({ pressed }) => [styles.round, pressed && styles.pressed, props.disabled && styles.disabled]}>
      {props.children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: Spacing.three,
    paddingRight: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: Fonts.bold, fontSize: 15 },
  sub: { fontFamily: Fonts.regular },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.35 },
  value: { minWidth: 76, textAlign: 'center', fontFamily: Fonts.bold, fontVariant: ['tabular-nums'] },
});
