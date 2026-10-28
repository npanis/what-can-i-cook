import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors, Fonts } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [Fonts.display]: BricolageGrotesque_700Bold,
    [Fonts.regular]: Figtree_400Regular,
    [Fonts.medium]: Figtree_500Medium,
    [Fonts.semibold]: Figtree_600SemiBold,
    [Fonts.bold]: Figtree_700Bold,
  });

  // If a font fails to load, carry on with system fonts rather than a stuck splash screen.
  const ready = loaded || !!error;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: Colors.accent,
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.semibold },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Pantry' }} />
        <Stack.Screen name="results" options={{ headerShown: false, title: 'Top recipes' }} />
        <Stack.Screen name="recipe/[slug]" options={{ title: 'Recipe steps' }} />
        <Stack.Screen name="term/[slug]" options={{ title: 'Cooking term', presentation: 'formSheet' }} />
      </Stack>
    </>
  );
}
