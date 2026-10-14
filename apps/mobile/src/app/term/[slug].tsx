import { TERMS } from '@wcic/content';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function TermScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const term = TERMS.find((t) => t.slug === slug);

  if (!term) {
    return (
      <View style={styles.container}>
        <ThemedText>We couldn't find that term.</ThemedText>
      </View>
    );
  }

  const related = TERMS.filter((t) => term.related.includes(t.slug));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ThemedText type="smallBold" themeColor="accent">
          Cooking term
        </ThemedText>
        <ThemedText type="title">{term.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {term.partOfSpeech}
        </ThemedText>
      </View>

      <ThemedText>{term.fullDefinition}</ThemedText>

      {term.guide && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {term.guideTitle}
          </ThemedText>
          {term.guide.map((g) => (
            <View key={g.label} style={styles.guideRow}>
              <ThemedText type="smallBold" style={styles.guideLabel}>
                {g.label}
              </ThemedText>
              <ThemedText type="small" style={styles.flex}>
                {g.result}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {related.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Related terms
          </ThemedText>
          {related.map((r) => (
            <Link key={r.slug} href={{ pathname: '/term/[slug]', params: { slug: r.slug } }} push>
              <ThemedText type="link">{r.name}</ThemedText>
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  header: { gap: Spacing.one },
  section: { gap: Spacing.two },
  guideRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
    backgroundColor: Colors.backgroundElement,
  },
  guideLabel: { minWidth: 64 },
  flex: { flex: 1 },
});
