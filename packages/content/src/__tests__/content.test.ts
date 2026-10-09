import { isStaple, normalizeIngredient, parseStep } from '@wcic/matching';
import { RECIPES } from '../recipes';
import { TERMS } from '../terms';

const termSlugs = new Set(TERMS.map((t) => t.slug));

describe.each(RECIPES.map((r) => [r.slug, r] as const))('%s', (_slug, recipe) => {
  it('links only to terms that exist', () => {
    const linked = recipe.steps.flatMap(parseStep).flatMap((p) => (p.kind === 'term' ? [p.slug] : []));
    expect(linked.filter((s) => !termSlugs.has(s))).toEqual([]);
  });

  it('uses canonical ingredient names', () => {
    for (const { ingredient } of recipe.ingredients) {
      expect(normalizeIngredient(ingredient)).toBe(ingredient);
    }
  });

  it('needs at least one pantry item beyond the staples', () => {
    expect(recipe.ingredients.some((i) => !i.optional && !isStaple(i.ingredient))).toBe(true);
  });
});

it('has unique recipe slugs', () => {
  expect(new Set(RECIPES.map((r) => r.slug)).size).toBe(RECIPES.length);
});

it('relates terms only to terms that exist', () => {
  for (const t of TERMS) expect(t.related.filter((s) => !termSlugs.has(s))).toEqual([]);
});
