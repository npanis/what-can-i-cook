import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { RecipeCard } from '@/components/recipe-card';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, ScreenPadding, Spacing } from '@/constants/theme';
import { useRecommendations } from '@/hooks/use-recommendations';
import { displayName } from '@/lib/labels';
import { listSentence } from '@/lib/pantry-text';
import { usePantry } from '@/store/pantry';

const RANKS = ['Best match', 'Runner-up', 'Also good'];

function heading(count: number): string {
  if (count === 0) return 'No strong match yet';
  if (count === 1) return 'Your best recipe';
  return `Top ${count} recipes for you`;
}

export default function ResultsScreen() {
  const items = usePantry((s) => s.items);
  const add = usePantry((s) => s.add);
  const { matches, suggestion } = useRecommendations(items);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton label="Back to pantry" />
        <View style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">
            {heading(matches.length)}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.using}>
            Using {listSentence(items)}
          </ThemedText>
        </View>

        <View style={styles.cards}>
          {matches.map((m, i) => (
            <RecipeCard key={m.recipe.slug} match={m} rank={RANKS[i] ?? 'Also good'} pantry={items} />
          ))}
        </View>

        {matches.length < 2 && (
          <View style={styles.suggest}>
            {suggestion ? (
              <>
                <ThemedText style={styles.suggestText}>
                  Add {suggestion.ingredient} to unlock {suggestion.unlocks} more recipe
                  {suggestion.unlocks === 1 ? '' : 's'}.
                </ThemedText>
                <Button
                  label={`Add ${suggestion.ingredient}`}
                  variant="dark"
                  onPress={() => add(displayName(suggestion.ingredient))}
                />
              </>
            ) : (
              <ThemedText style={styles.suggestText}>Try adding a few more items from your kitchen.</ThemedText>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary">
            Not quite right?
          </ThemedText>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
            <ThemedText type="link">Edit my pantry</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, paddingHorizontal: ScreenPadding, paddingTop: Spacing.two, paddingBottom: Spacing.four, gap: 18 },
  header: { gap: 6 },
  using: { fontSize: 15 },
  cards: { gap: 12 },
  suggest: {
    gap: 12,
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.warnSoft,
  },
  suggestText: { color: Colors.warnText },
  footer: { marginTop: 'auto', alignItems: 'center', gap: Spacing.one, paddingTop: Spacing.four },
});
