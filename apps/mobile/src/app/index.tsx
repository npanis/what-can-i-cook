import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { usePantry } from '@/store/pantry';

const QUICK_ADD = ['Garlic', 'Onion', 'Milk', 'Rice', 'Tomato', 'Pasta'];

export default function PantryScreen() {
  const { items, add, remove } = usePantry();
  const [text, setText] = useState('');

  const submit = () => {
    add(text);
    setText('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <ThemedText type="title">What's in your pantry?</ThemedText>
        <ThemedText themeColor="textSecondary">
          Add what you have, no amounts needed. Salt, pepper and oil are already counted.
        </ThemedText>
      </View>

      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        placeholder="Type an ingredient, e.g. eggs"
        placeholderTextColor={Colors.textMuted}
        returnKeyType="done"
        autoCapitalize="none"
        submitBehavior="submit"
        style={styles.input}
        accessibilityLabel="Add an ingredient"
      />

      {items.length > 0 && (
        <View style={styles.chips}>
          {items.map((item) => (
            <Chip key={item} label={`${item}  ✕`} accessibilityLabel={`Remove ${item}`} onPress={() => remove(item)} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Quick add
        </ThemedText>
        <View style={styles.chips}>
          {QUICK_ADD.filter((q) => !items.includes(q)).map((q) => (
            <Chip key={q} label={`+ ${q}`} variant="outline" accessibilityLabel={`Add ${q}`} onPress={() => add(q)} />
          ))}
        </View>
      </View>

      <Button label="Find recipes" disabled={items.length === 0} onPress={() => router.push('/results')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.four, gap: Spacing.four },
  header: { gap: Spacing.two },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  section: { gap: Spacing.two },
});
