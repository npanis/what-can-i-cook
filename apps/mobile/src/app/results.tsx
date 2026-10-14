import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useRecommendations } from '@/hooks/use-recommendations';
import { displayName } from '@/lib/labels';
import { usePantry } from '@/store/pantry';

const RANKS = ['Best match', 'Runner-up', 'Also good'];

export default function ResultsScreen() {
  const items = usePantry((s) => s.items);
  const add = usePantry((s) => s.add);
  const { matches, suggestion } = useRecommendations(items);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {matches.map((m, i) => (
        <Link key={m.recipe.slug} href={{ pathname: '/recipe/[slug]', params: { slug: m.recipe.slug } }} asChild>
          <Pressable style={styles.card} accessibilityRole="button">
            <View style={styles.cardTop}>
              <ThemedText type="smallBold" themeColor="accent">
                {RANKS[i]}
              </ThemedText>
              <ThemedText type="smallBold">{Math.round(m.score * 100)}%</ThemedText>
            </View>
            <ThemedText type="subtitle">{m.recipe.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {m.recipe.minutes} min · {displayName(m.recipe.difficulty)}
            </ThemedText>
            <ThemedText type="small">You have: {m.have.map(displayName).join(', ')}</ThemedText>
            <ThemedText type="small">
              Also need:{' '}
              {m.need.length === 0 && m.optionalMissing.length === 0
                ? 'Nothing else'
                : [...m.need.map(displayName), ...m.optionalMissing.map((o) => `${displayName(o)} (optional)`)].join(', ')}
            </ThemedText>
          </Pressable>
        </Link>
      ))}

      {matches.length < 2 && (
        <View style={styles.empty}>
          <ThemedText type="subtitle">
            {matches.length === 0 ? 'No strong match yet' : 'Only one strong match'}
          </ThemedText>
          {suggestion ? (
            <>
              <ThemedText>
                Add {suggestion.ingredient} to unlock {suggestion.unlocks} recipe{suggestion.unlocks === 1 ? '' : 's'}.
              </ThemedText>
              <Button
                label={`Add ${suggestion.ingredient}`}
                onPress={() => add(displayName(suggestion.ingredient))}
              />
            </>
          ) : (
            <ThemedText>Try adding a few more items from your kitchen.</ThemedText>
          )}
          <Pressable onPress={() => router.back()} accessibilityRole="button">
            <ThemedText type="link">Edit pantry</ThemedText>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.three },
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.backgroundElement,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  empty: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.warnSoft,
  },
});
