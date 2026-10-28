/** "eggs, bread, butter and cheddar" */
export function listSentence(items: string[]): string {
  const lower = items.map((i) => i.toLowerCase());
  if (lower.length <= 1) return lower.join('');
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

export function itemsLabel(n: number): string {
  return n === 1 ? '1 item' : `${n} items`;
}

/** The hint under Find recipes, from the on-phone estimate. */
export function matchHint(itemCount: number, matchCount: number): string {
  if (itemCount === 0) return 'Add at least one ingredient to start';
  if (matchCount === 0) return "No strong match yet. We'll suggest what to add";
  return matchCount === 1 ? '1 recipe matches what you have' : `${matchCount} recipes match what you have`;
}
