import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { AddChip, PantryChip } from '@/components/chip';
import { ArrowRightIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, ScreenPadding, Spacing } from '@/constants/theme';
import { itemsLabel, matchHint } from '@/lib/pantry-text';
import { recommendOffline } from '@/lib/recommend';
import { usePantry } from '@/store/pantry';

const QUICK_ADD = ['Garlic', 'Onion', 'Milk', 'Rice', 'Tomato', 'Pasta'];

export default function PantryScreen() {
  const { items, add, remove } = usePantry();
  const [text, setText] = useState('');
  const matchCount = useMemo(() => recommendOffline(items).matches.length, [items]);
  const quickAdd = QUICK_ADD.filter((q) => !items.some((i) => i.toLowerCase() === q.toLowerCase()));

  const submit = () => {
    add(text);
    setText('');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText type="eyebrow">What can I cook?</ThemedText>
          <ThemedText type="display" accessibilityRole="header">
            What&apos;s in your pantry?
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Add what you have, no amounts needed. We&apos;ll find 2 to 3 recipes and tell you anything extra you&apos;d
            need.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="label" nativeID="add-ingredient-label">
            Add an ingredient
          </ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={submit}
              placeholder="e.g. eggs, rice, spinach"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              submitBehavior="submit"
              style={styles.input}
              accessibilityLabel="Add an ingredient"
              accessibilityLabelledBy="add-ingredient-label"
            />
            <Button label="Add" variant="dark" onPress={submit} disabled={!text.trim()} />
          </View>
        </View>

        {items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle} accessibilityRole="header">
                In your pantry
              </ThemedText>
              <ThemedText type="label" themeColor="textSecondary" style={styles.count}>
                {itemsLabel(items.length)}
              </ThemedText>
            </View>
            <View style={styles.chips}>
              {items.map((item) => (
                <PantryChip key={item} label={item} onRemove={() => remove(item)} />
              ))}
            </View>
          </View>
        )}

        {quickAdd.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} accessibilityRole="header">
              Quick add staples
            </ThemedText>
            <View style={styles.chips}>
              {quickAdd.map((q) => (
                <AddChip key={q} label={q} onPress={() => add(q)} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Find recipes"
          disabled={items.length === 0}
          onPress={() => router.push('/results')}
          icon={<ArrowRightIcon color={Colors.surface} />}
        />
        <ThemedText type="label" themeColor="textSecondary" style={styles.hint}>
          {matchHint(items.length, matchCount)}
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: ScreenPadding, paddingTop: Spacing.five, paddingBottom: Spacing.four, gap: Spacing.four },
  header: { gap: 6 },
  intro: { marginTop: Spacing.one, fontSize: 15, lineHeight: 22 },
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 15 },
  count: { fontFamily: Fonts.regular, fontVariant: ['tabular-nums'] },
  inputRow: { flexDirection: 'row', gap: Spacing.two },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    backgroundColor: Colors.surface,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.text,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: ScreenPadding,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  hint: { textAlign: 'center', fontFamily: Fonts.regular },
});
