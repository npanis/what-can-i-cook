/**
 * Colors and spacing from the Phase 1 design canvas.
 * The app is light-only for Phase 1.
 */

export const Colors = {
  text: '#1E2621',
  textSecondary: '#56625A',
  textMuted: '#8A948C',
  background: '#FFFFFF',
  backgroundElement: '#F4F5EF',
  border: '#DCE0D5',
  accent: '#2F6B4F',
  accentPressed: '#1F4A36',
  accentSoft: '#E3EEE6',
  warnSoft: '#FCEFD2',
  warnText: '#6B4500',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  chip: 999,
  card: 14,
  sheet: 24,
} as const;
