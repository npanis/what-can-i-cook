const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
];

/** Formats a number the way recipes do: 1½, ¾, 3. Rounds to the nearest common fraction. */
export function formatQuantity(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const rest = n - whole;
  if (rest < 0.125) return String(whole);
  if (rest > 0.875) return String(whole + 1);
  const [, glyph] = FRACTIONS.reduce((best, f) => (Math.abs(f[0] - rest) < Math.abs(best[0] - rest) ? f : best));
  return whole === 0 ? glyph : `${whole}${glyph}`;
}

/** Units that read the same in singular and plural. */
const INVARIANT_UNITS = new Set(['tsp', 'tbsp', 'g', 'kg', 'ml', 'l', 'oz', 'lb']);

function pluralUnit(unit: string, quantity: number): string {
  if (quantity <= 1 || INVARIANT_UNITS.has(unit)) return unit;
  if (unit.endsWith('ch') || unit.endsWith('sh')) return unit + 'es';
  return unit + 's';
}

/**
 * Amount text for a recipe written for 1 person, scaled for `people`.
 * e.g. (2, undefined, 2) → "4", (1, "slice", 2) → "2 slices", (0.5, "cup", 3) → "1½ cups".
 */
export function formatAmount(amount: number | undefined, unit: string | undefined, people: number): string {
  if (amount === undefined) return unit ?? '';
  const scaled = amount * people;
  const qty = formatQuantity(scaled);
  return unit ? `${qty} ${pluralUnit(unit, scaled)}` : qty;
}
