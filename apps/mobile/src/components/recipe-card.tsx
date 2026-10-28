import { normalizeIngredient, STAPLE_ALIASES, type Match } from '@wcic/matching';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Tag } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { displayName } from '@/lib/labels';

interface RecipeCardProps {
  match: Match;
  rank: string;
  /** The pantry as typed, so tags read "Eggs" rather than the canonical "egg". */
  pantry: string[];
}

export function RecipeCard({ match, rank, pantry }: RecipeCardProps) {
  const { recipe, score, have, need, optionalMissing } = match;
  const percent = Math.round(score * 100);
  const needLabels = [...need.map(displayName), ...optionalMissing.map((o) => `${displayName(o)} (optional)`)];
  const meta = `${recipe.minutes} min · ${displayName(recipe.difficulty)}`;
  const typed = (ingredient: string) =>
    pantry.find((p) => normalizeIngredient(p, STAPLE_ALIASES) === ingredient) ?? displayName(ingredient);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/recipe/[slug]', params: { slug: recipe.slug } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${rank}: ${recipe.title}. ${meta}. ${percent}% match.`}>
      <View style={styles.top}>
        <View style={styles.titleBlock}>
          <ThemedText type="eyebrow">{rank}</ThemedText>
          <ThemedText type="subtitle">{recipe.title}</ThemedText>
          <ThemedText type="label" themeColor="textSecondary" style={styles.meta}>
            {meta}
          </ThemedText>
        </View>
        <View style={styles.badge}>
          <ThemedText style={styles.badgePercent}>{percent}%</ThemedText>
          <ThemedText style={styles.badgeLabel}>match</ThemedText>
        </View>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>You have</ThemedText>
          {have.map((h) => (
            <Tag key={h} label={typed(h)} tone="have" />
          ))}
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Also need</ThemedText>
          {needLabels.length === 0 ? (
            <ThemedText style={styles.nothing}>Nothing else</ThemedText>
          ) : (
            needLabels.map((n) => <Tag key={n} label={n} tone="need" />)
          )}
        </View>
      </View>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pressed: { opacity: 0.8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  titleBlock: { flex: 1, gap: Spacing.one },
  meta: { fontFamily: Fonts.regular, fontVariant: ['tabular-nums'] },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoft,
  },
  badgePercent: { fontFamily: Fonts.bold, fontSize: 16, lineHeight: 19, color: Colors.accentText, fontVariant: ['tabular-nums'] },
  badgeLabel: { fontFamily: Fonts.semibold, fontSize: 10, lineHeight: 12, color: Colors.accentText },
  rows: { gap: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  rowLabel: { width: 60, fontFamily: Fonts.semibold, fontSize: 12, lineHeight: 16, color: Colors.textSecondary },
  nothing: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.accentText },
});
