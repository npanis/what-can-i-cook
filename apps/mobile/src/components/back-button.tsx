import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ArrowLeftIcon } from '@/components/icons';
import { Colors } from '@/constants/theme';

export function BackButton({ label = 'Back' }: { label?: string }) {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <ArrowLeftIcon color={Colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, marginLeft: -10, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: Colors.border },
});
