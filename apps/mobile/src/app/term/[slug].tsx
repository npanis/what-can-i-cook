import { TERMS } from '@wcic/content';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, ScreenPadding, Spacing } from '@/constants/theme';

export default function TermScreen() {
  const { slug, step, recipe } = useLocalSearchParams<{ slug: string; step?: string; recipe?: string }>();
  const term = TERMS.find((t) => t.slug === slug);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!term) {
    return (
      <View style={styles.sheet}>
        <ThemedText>We couldn&apos;t find that term.</ThemedText>
        <Button label="Back" variant="dark" onPress={back} />
      </View>
    );
  }

  const related = TERMS.filter((t) => term.related.includes(t.slug));

  return (
    <SafeAreaView style={styles.sheet} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {recipe && (
          <ThemedText type="label" themeColor="textSecondary" style={styles.context}>
            {recipe}
            {step ? ` · Step ${step}` : ''}
          </ThemedText>
        )}
        <View style={styles.header}>
          <ThemedText type="eyebrow">Cooking term</ThemedText>
          <ThemedText type="display" accessibilityRole="header">
            {term.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {term.partOfSpeech}
          </ThemedText>
        </View>

        <ThemedText style={styles.definition}>{term.fullDefinition}</ThemedText>

        {term.guide && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} accessibilityRole="header">
              {term.guideTitle}
            </ThemedText>
            <View style={styles.table}>
              {term.guide.map((g, i) => (
                <View key={g.label} style={[styles.row, i > 0 && styles.rowBorder]}>
                  <ThemedText style={styles.rowLabel}>{g.label}</ThemedText>
                  <ThemedText style={styles.rowResult}>{g.result}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {related.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} accessibilityRole="header">
              Related terms
            </ThemedText>
            <View style={styles.related}>
              {related.map((r) => (
                <Pressable
                  key={r.slug}
                  accessibilityRole="button"
                  onPress={() => router.setParams({ slug: r.slug })}
                  style={({ pressed }) => [styles.relatedChip, pressed && styles.pressed]}>
                  <ThemedText style={styles.relatedLabel}>{r.name}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Button label={step ? `Back to step ${step}` : 'Back to recipe'} variant="dark" onPress={back} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingHorizontal: ScreenPadding, paddingTop: Spacing.four, paddingBottom: Spacing.four, gap: 18 },
  context: { fontFamily: Fonts.regular },
  header: { gap: 6 },
  definition: { lineHeight: 24 },
  section: { gap: Spacing.two },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 15 },
  table: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 10, paddingHorizontal: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  rowLabel: { width: 72, fontFamily: Fonts.bold, fontSize: 14, fontVariant: ['tabular-nums'] },
  rowResult: { flex: 1, fontSize: 14 },
  related: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  relatedChip: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  relatedLabel: { fontFamily: Fonts.semibold, fontSize: 14 },
  pressed: { opacity: 0.6 },
});
