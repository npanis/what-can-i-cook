/** Words that look plural but aren't, or have irregular plurals. */
const SINGULAR_EXCEPTIONS: Record<string, string> = {
  asparagus: 'asparagus',
  couscous: 'couscous',
  hummus: 'hummus',
  molasses: 'molasses',
  oats: 'oats',
  peas: 'pea',
  chives: 'chives',
  noodles: 'noodle',
  leaves: 'leaf',
  loaves: 'loaf',
  halves: 'half',
  cheeses: 'cheese',
};

const ES_ENDINGS = ['ches', 'shes', 'sses', 'xes', 'zes', 'oes'];

export function singularize(word: string): string {
  if (word in SINGULAR_EXCEPTIONS) return SINGULAR_EXCEPTIONS[word];
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (ES_ENDINGS.some((e) => word.endsWith(e))) return word.slice(0, -2);
  if (word.endsWith('ss') || word.endsWith('us')) return word;
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

export type AliasMap = Record<string, string>;

/**
 * Turns what a person typed into a canonical ingredient name:
 * lowercase, punctuation stripped, last word singular, then aliases.
 */
export function normalizeIngredient(input: string, aliases: AliasMap = {}): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  if (cleaned in aliases) return aliases[cleaned];
  const words = cleaned.split(' ');
  words[words.length - 1] = singularize(words[words.length - 1]);
  const singular = words.join(' ');
  return aliases[singular] ?? singular;
}
