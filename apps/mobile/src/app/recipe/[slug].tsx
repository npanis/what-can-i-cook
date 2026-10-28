import { TERMS } from '@wcic/content';
import { formatAmount, isStaple, parseStep, toPantrySet, type RecipeIngredient } from '@wcic/matching';
import { router, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { Fragment, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { CheckIcon, PlusIcon } from '@/components/icons';
import { ServingsStepper } from '@/components/servings-stepper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, ScreenPadding, Spacing } from '@/constants/theme';
import { displayName, ingredientLabel } from '@/lib/labels';
import { findRecipe } from '@/lib/recommend';
import { useHistory } from '@/store/history';
import { usePantry } from '@/store/pantry';

type GroupTone = 'have' | 'need' | 'staple';

const GROUPS: { tone: GroupTone; title: string }[] = [
  { tone: 'have', title: 'From your pantry' },
  { tone: 'need', title: 'You also need' },
  { tone: 'staple', title: 'Kitchen staples' },
];

const TONE_COLOR: Record<GroupTone, string> = {
  have: Colors.accent,
  need: Colors.warnText,
  staple: Colors.textMuted,
};

export default function RecipeScreen() {
  // Cooks look away from the screen for minutes at a time; don't let it lock mid-recipe.
  useKeepAwake();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const recipe = findRecipe(slug);
  const items = usePantry((s) => s.items);
  const pantry = useMemo(() => toPantrySet(items), [items]);
  const [people, setPeople] = useState(1);
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const cooked = useHistory((s) => s.entries.some((e) => e.slug === slug));
  const markCooked = useHistory((s) => s.markCooked);
  const undo = useHistory((s) => s.undo);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <BackButton />
          <ThemedText>We couldn&apos;t find that recipe.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const toneOf = (i: RecipeIngredient): GroupTone =>
    isStaple(i.ingredient) ? 'staple' : pantry.has(i.ingredient) ? 'have' : 'need';
  const groups = GROUPS.map((g) => ({ ...g, list: recipe.ingredients.filter((i) => toneOf(i) === g.tone) })).filter(
    (g) => g.list.length > 0,
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton label="Back to recipes" />
        <View style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">
            {recipe.title}
          </ThemedText>
          <View style={styles.meta}>
            <ThemedText type="small" themeColor="textSecondary">
              {recipe.minutes} min
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {displayName(recipe.difficulty)}
            </ThemedText>
          </View>
        </View>

        <ServingsStepper people={people} onChange={setPeople} />

        <View style={styles.card}>
          {groups.map((g, gi) => (
            <Fragment key={g.tone}>
              {gi > 0 && <View style={styles.divider} />}
              <ThemedText style={[styles.groupTitle, { color: g.tone === 'staple' ? Colors.textSecondary : TONE_COLOR[g.tone] }]}>
                {g.title}
              </ThemedText>
              {g.list.map((i) => (
                <View key={i.ingredient} style={styles.ingredient}>
                  {g.tone === 'need' ? <PlusIcon size={14} color={TONE_COLOR.need} /> : <CheckIcon color={TONE_COLOR[g.tone]} />}
                  <ThemedText style={styles.amount}>{displayName(formatAmount(i.amount, i.unit, people)) || '—'}</ThemedText>
                  <ThemedText style={styles.ingredientName}>{ingredientLabel(i, people)}</ThemedText>
                </View>
              ))}
            </Fragment>
          ))}
        </View>

        <View style={styles.steps}>
          <View style={styles.stepsHeader}>
            <ThemedText style={styles.stepsTitle} accessibilityRole="header">
              Steps
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary" style={styles.stepsHint}>
              Tap an underlined word for its meaning
            </ThemedText>
          </View>
          {recipe.steps.map((step, n) => {
            const parts = parseStep(step);
            const shown = parts.some((p) => p.kind === 'term' && p.slug === openTerm);
            const term = shown ? TERMS.find((t) => t.slug === openTerm) : undefined;
            return (
              <View key={n} style={styles.step}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>{n + 1}</ThemedText>
                </View>
                <View style={styles.stepBody}>
                  <ThemedText style={styles.stepText}>
                    {parts.map((p, k) =>
                      p.kind === 'text' ? (
                        p.text
                      ) : (
                        <ThemedText
                          key={k}
                          style={styles.term}
                          onPress={() => setOpenTerm(openTerm === p.slug ? null : p.slug)}
                          accessibilityRole="button"
                          accessibilityHint="Shows what this cooking term means">
                          {p.text}
                        </ThemedText>
                      ),
                    )}
                  </ThemedText>
                  {term && (
                    <View style={styles.definition}>
                      <ThemedText style={styles.definitionText}>
                        <ThemedText style={[styles.definitionText, styles.bold]}>{term.name}: </ThemedText>
                        {term.shortDefinition}
                      </ThemedText>
                      <Pressable
                        accessibilityRole="link"
                        hitSlop={8}
                        onPress={() =>
                          router.push({
                            pathname: '/term/[slug]',
                            params: { slug: term.slug, step: String(n + 1), recipe: recipe.title },
                          })
                        }>
                        <ThemedText style={[styles.definitionText, styles.bold, styles.underline]}>
                          {term.guide ? 'See the timing guide' : 'Learn more'}
                        </ThemedText>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.cookedSection}>
          {cooked ? (
            <>
              <View style={styles.saved} accessibilityLiveRegion="polite">
                <CheckIcon color={Colors.accentText} />
                <ThemedText style={styles.savedText}>Saved to your history</ThemedText>
              </View>
              <Pressable onPress={() => undo(recipe.slug)} accessibilityRole="button" style={styles.undo}>
                <ThemedText type="link">Undo</ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <Button label="I cooked this" onPress={() => markCooked(recipe.slug, people)} />
              <ThemedText type="label" themeColor="textSecondary" style={styles.center}>
                Saves it to your history on this phone
              </ThemedText>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: ScreenPadding, paddingTop: Spacing.two, paddingBottom: Spacing.five, gap: 22 },
  header: { gap: Spacing.two },
  meta: { flexDirection: 'row', gap: Spacing.three },
  card: {
    gap: 10,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  divider: { height: 1, marginVertical: Spacing.one, backgroundColor: Colors.border },
  groupTitle: { fontFamily: Fonts.bold, fontSize: 13, letterSpacing: 1.3, textTransform: 'uppercase' },
  ingredient: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  amount: { width: 72, fontFamily: Fonts.semibold, fontSize: 15, fontVariant: ['tabular-nums'] },
  ingredientName: { flex: 1, fontSize: 15 },
  steps: { gap: Spacing.three },
  stepsHeader: { gap: Spacing.one },
  stepsTitle: { fontFamily: Fonts.display, fontSize: 22, lineHeight: 26 },
  stepsHint: { fontFamily: Fonts.regular },
  step: { flexDirection: 'row', gap: 12 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ink,
  },
  stepNumberText: { fontFamily: Fonts.bold, fontSize: 14, lineHeight: 18, color: Colors.surface },
  stepBody: { flex: 1, gap: Spacing.two },
  stepText: { fontSize: 16, lineHeight: 24 },
  term: {
    fontFamily: Fonts.bold,
    color: Colors.accent,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  definition: { gap: Spacing.two, paddingVertical: 12, paddingHorizontal: 14, borderRadius: Radius.input, backgroundColor: Colors.accentSoft },
  definitionText: { fontSize: 14, lineHeight: 20, color: Colors.accentText },
  bold: { fontFamily: Fonts.bold },
  underline: { textDecorationLine: 'underline' },
  cookedSection: { gap: Spacing.two, paddingTop: Spacing.two, borderTopWidth: 1, borderTopColor: Colors.border },
  saved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 56,
    borderRadius: Radius.button,
    backgroundColor: Colors.accentSoft,
  },
  savedText: { fontFamily: Fonts.bold, color: Colors.accentText },
  undo: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 12 },
  center: { textAlign: 'center', fontFamily: Fonts.regular },
});
