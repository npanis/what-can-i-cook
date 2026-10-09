import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: Colors.accent,
          headerTitleStyle: { color: Colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="index" options={{ title: 'What can I cook?' }} />
        <Stack.Screen name="results" options={{ title: 'Top recipes' }} />
        <Stack.Screen name="recipe/[slug]" options={{ title: 'Recipe steps' }} />
        <Stack.Screen name="term/[slug]" options={{ title: 'Cooking term', presentation: 'formSheet' }} />
      </Stack>
    </>
  );
}
