import { recommend, scoreRecipe, suggestIngredient, toPantrySet } from '../match';
import { RECIPES } from './fixtures';

const bySlug = (slug: string) => RECIPES.find((r) => r.slug === slug)!;

describe('scoreRecipe', () => {
  it('never counts staples as missing', () => {
    const m = scoreRecipe(bySlug('soft-boiled-eggs-with-toast'), toPantrySet(['eggs', 'bread', 'butter']));
    expect(m.score).toBe(1);
    expect(m.need).toEqual([]);
  });

  it('does not lower the score for a missing optional item', () => {
    const m = scoreRecipe(bySlug('egg-in-a-hole'), toPantrySet(['eggs', 'bread', 'butter']));
    expect(m.score).toBe(1);
    expect(m.optionalMissing).toEqual(['chives']);
  });

  it('maps typed staples like olive oil to the generic staple', () => {
    expect(toPantrySet(['Olive oil', 'pepper'])).toEqual(new Set(['oil', 'black pepper']));
    const m = scoreRecipe(bySlug('tomato-pasta'), toPantrySet(['pasta', 'tomatoes', 'garlic']));
    expect(m.score).toBe(1);
  });
});

describe('recommend', () => {
  it('returns the top 3, best match first, then fewest missing, then fastest', () => {
    const { matches, suggestion } = recommend(['Eggs', 'bread', 'butter', 'cheddar'], RECIPES);
    expect(matches.map((m) => m.recipe.slug)).toEqual([
      'egg-in-a-hole',
      'soft-boiled-eggs-with-toast',
      'cheese-omelette',
    ]);
    expect(suggestion).toBeUndefined();
  });

  it('drops recipes under 60% and suggests the item that unlocks the most', () => {
    const { matches, suggestion } = recommend(['eggs'], RECIPES);
    expect(matches).toEqual([]);
    expect(suggestion).toEqual({ ingredient: 'butter', unlocks: 3 });
  });

  it('ignores recipes that share nothing with the pantry', () => {
    expect(recommend([], RECIPES).matches).toEqual([]);
  });
});

describe('suggestIngredient', () => {
  it('returns undefined when nothing can be unlocked by one item', () => {
    expect(suggestIngredient(RECIPES, toPantrySet(['saffron']))).toBeUndefined();
  });
});
