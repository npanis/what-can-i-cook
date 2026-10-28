/**
 * Colors, type and spacing from the Phase 1 design canvas.
 * The app is light-only for Phase 1.
 */

export const Colors = {
  text: '#1E2621',
  textSecondary: '#56625A',
  textMuted: '#8A948C',
  /** Screen background. */
  background: '#F4F5EF',
  /** Cards, inputs and chips sit on this. */
  surface: '#FFFFFF',
  backgroundElement: '#FFFFFF',
  border: '#DCE0D5',
  borderDashed: '#B9C0B1',
  accent: '#2F6B4F',
  accentPressed: '#1F4A36',
  accentSoft: '#E3EEE6',
  accentText: '#1F4A36',
  warnSoft: '#FCEFD2',
  warnText: '#6B4500',
  ink: '#1E2621',
} as const;

export type ThemeColor = keyof typeof Colors;

/** Custom fonts pick their weight by family name, so each weight is its own family. */
export const Fonts = {
  display: 'BricolageGrotesque_700Bold',
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Side padding for screens, from the design. */
export const ScreenPadding = 20;

export const Radius = {
  chip: 999,
  input: 12,
  card: 18,
  button: 16,
  sheet: 24,
} as const;
