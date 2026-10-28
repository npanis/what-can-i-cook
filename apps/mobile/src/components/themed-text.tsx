import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts, ThemeColor } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'display' | 'title' | 'subtitle' | 'eyebrow' | 'label' | 'small' | 'smallBold' | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  return <Text style={[{ color: Colors[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 23 },
  display: { fontFamily: Fonts.display, fontSize: 34, lineHeight: 36, letterSpacing: -0.3 },
  title: { fontFamily: Fonts.display, fontSize: 30, lineHeight: 33 },
  subtitle: { fontFamily: Fonts.display, fontSize: 20, lineHeight: 23 },
  eyebrow: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.accent,
  },
  label: { fontFamily: Fonts.semibold, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  smallBold: { fontFamily: Fonts.bold, fontSize: 15, lineHeight: 20 },
  link: { fontFamily: Fonts.bold, fontSize: 15, lineHeight: 22, color: Colors.accent },
});
