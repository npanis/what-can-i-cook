import type { RecipeIngredient } from '@wcic/matching';

/** "black pepper" → "Black pepper" */
export function displayName(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function peopleLabel(n: number): string {
  return n === 1 ? '1 person' : `${n} people`;
}

/** Name for the ingredient list: countable items read as plural when there is more than one ("4 Eggs"). */
export function ingredientLabel(i: RecipeIngredient, people: number): string {
  const countable = i.amount !== undefined && !i.unit;
  const name = countable && i.amount! * people > 1 ? pluralize(i.ingredient) : i.ingredient;
  return displayName(name) + (i.optional ? ' (optional)' : '');
}

function pluralize(name: string): string {
  if (/(o|ch|sh|s|x)$/.test(name)) return name + 'es';
  if (/[^aeiou]y$/.test(name)) return name.slice(0, -1) + 'ies';
  return name + 's';
}
