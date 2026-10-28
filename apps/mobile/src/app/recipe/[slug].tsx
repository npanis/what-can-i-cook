import { TERMS } from '@wcic/content';
import { formatAmount, isStaple, parseStep, toPantrySet, type RecipeIngredient } from '@wcic/matching';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { displayName, ingredientLabel, peopleLabel } from '@/lib/labels';
import { findRecipe } from '@/lib/recommend';
import { useHistory } from '@/store/history';
import { usePantry } from '@/store/pantry';

const MIN_PEOPLE = 1;
const MAX_PEOPLE = 6;

export default function RecipeScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const recipe = findRecipe(slug);
  const items = usePantry((s) => s.items);
  const pantry = useMemo(() => toPantrySet(items), [items]);
  const [people, setPeople] = useState(1);
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const cooked = useHistory((s) => s.entries.some((e) => e.slug === slug));
  const { markCooked, undo } = useHistory();

  if (!recipe) {
    return (
      <View style={styles.container}>
        <ThemedText>We couldn't find that recipe.</ThemedText>
      </View>
    );
  }

  const groups: [string, RecipeIngredient[]][] = [
    ['From your pantry', recipe.ingredients.filter((i) => !isStaple(i.ingredient) && pantry.has(i.ingredient))],
    ['You also need', recipe.ingredients.filter((i) => !isStaple(i.ingredient) && !pantry.has(i.ingredient))],
    ['Kitchen staples', recipe.ingredients.filter((i) => isStaple(i.ingredient))],
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: recipe.title }} />
      <View style={styles.header}>
        <ThemedText type="title">{recipe.title}</ThemedText>
        <ThemedText themeColor="textSecondary">
          {recipe.minutes} min · {displayName(recipe.difficulty)}
        </ThemedText>
      </View>

      <View style={styles.stepper}>
        <View style={styles.flex}>
          <ThemedText type="smallBold">Cooking for</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Amounts update to match
          </ThemedText>
        </View>
        <View style={styles.stepperControls}>
          <StepperButton label="−" a11y="Fewer people" disabled={people <= MIN_PEOPLE} onPress={() => setPeople(people - 1)} />
          <ThemedText type="smallBold" style={styles.peopleLabel}>
            {peopleLabel(people)}
          </ThemedText>
          <StepperButton label="+" a11y="More people" disabled={people >= MAX_PEOPLE} onPress={() => setPeople(people + 1)} />
        </View>
      </View>

      {groups
        .filter(([, list]) => list.length > 0)
        .map(([title, list]) => (
          <View key={title} style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {title}
            </ThemedText>
            {list.map((i) => (
              <View key={i.ingredient} style={styles.ingredientRow}>
                <ThemedText style={styles.amount}>{displayName(formatAmount(i.amount, i.unit, people)) || '—'}</ThemedText>
                <ThemedText>
                  {ingredientLabel(i, people)}
                </ThemedText>
              </View>
            ))}
          </View>
        ))}

      <View style={styles.section}>
        <ThemedText type="subtitle">Steps</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Tap an underlined word for its meaning
        </ThemedText>
        {recipe.steps.map((step, n) => {
          const parts = parseStep(step);
          const termHere = parts.find((p) => p.kind === 'term' && p.slug === openTerm);
          const term = termHere && TERMS.find((t) => t.slug === openTerm);
          return (
            <View key={n} style={styles.step}>
              <ThemedText type="smallBold" themeColor="accent">
                {n + 1}
              </ThemedText>
              <View style={styles.stepBody}>
                <ThemedText>
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
                    <ThemedText type="small">
                      <ThemedText type="smallBold">{term.name}: </ThemedText>
                      {term.shortDefinition}
                    </ThemedText>
                    <Link href={{ pathname: '/term/[slug]', params: { slug: term.slug } }}>
                      <ThemedText type="link">{term.guide ? 'See the timing guide' : 'Learn more'}</ThemedText>
                    </Link>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {cooked ? (
        <View style={styles.cooked}>
          <ThemedText type="smallBold">Saved to your history</ThemedText>
          <Pressable onPress={() => undo(recipe.slug)} accessibilityRole="button">
            <ThemedText type="link">Undo</ThemedText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.section}>
          <Button label="I cooked this" onPress={() => markCooked(recipe.slug, people)} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
            Saves it to your history on this phone
          </ThemedText>
        </View>
      )}
    </ScrollView>
  );
}

function StepperButton(props: { label: string; a11y: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.a11y}
      style={[styles.stepperButton, props.disabled && styles.dim]}>
      <ThemedText type="subtitle" themeColor="accent">
        {props.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  header: { gap: Spacing.one },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.backgroundElement,
  },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  dim: { opacity: 0.4 },
  flex: { flex: 1 },
  peopleLabel: { minWidth: 76, textAlign: 'center' },
  section: { gap: Spacing.two },
  ingredientRow: { flexDirection: 'row', gap: Spacing.three },
  amount: { minWidth: 72, fontWeight: 700 },
  step: { flexDirection: 'row', gap: Spacing.three },
  stepBody: { flex: 1, gap: Spacing.two },
  term: { textDecorationLine: 'underline', color: Colors.accent, fontWeight: 700 },
  definition: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.card, backgroundColor: Colors.accentSoft },
  cooked: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.accentSoft,
  },
  center: { textAlign: 'center' },
});
