/** Assumed to be in every kitchen, so never listed as missing (Phase 1 decision). */
export const STAPLES = ['salt', 'black pepper', 'oil'] as const;

export const STAPLE_ALIASES = {
  pepper: 'black pepper',
  'ground pepper': 'black pepper',
  'olive oil': 'oil',
  'vegetable oil': 'oil',
  'cooking oil': 'oil',
  'sea salt': 'salt',
} as const;

export function isStaple(ingredient: string): boolean {
  return (STAPLES as readonly string[]).includes(ingredient);
}
