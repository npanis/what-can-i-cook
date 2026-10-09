import { normalizeIngredient, type AliasMap } from './normalize';
import { isStaple, STAPLE_ALIASES } from './staples';
import type { Match, Recipe, RecommendResult, Suggestion } from './types';

export const MIN_SCORE = 0.6;
export const MAX_RESULTS = 3;

export interface RecommendOptions {
  aliases?: AliasMap;
  minScore?: number;
  maxResults?: number;
}

export function toPantrySet(items: string[], aliases: AliasMap = {}): Set<string> {
  const all = { ...STAPLE_ALIASES, ...aliases };
  return new Set(items.map((i) => normalizeIngredient(i, all)).filter(Boolean));
}

export function scoreRecipe(recipe: Recipe, pantry: Set<string>): Match {
  const have: string[] = [];
  const need: string[] = [];
  const optionalMissing: string[] = [];
  let haveRequired = 0;
  for (const { ingredient, optional } of recipe.ingredients) {
    if (isStaple(ingredient)) continue;
    if (pantry.has(ingredient)) {
      have.push(ingredient);
      if (!optional) haveRequired++;
    } else if (optional) optionalMissing.push(ingredient);
    else need.push(ingredient);
  }
  const required = haveRequired + need.length;
  const score = required === 0 ? 0 : haveRequired / required;
  return { recipe, score, have, need, optionalMissing };
}

function byBestMatch(a: Match, b: Match): number {
  return (
    b.score - a.score ||
    a.need.length - b.need.length ||
    a.recipe.minutes - b.recipe.minutes ||
    a.recipe.title.localeCompare(b.recipe.title)
  );
}

export function rankRecipes(recipes: Recipe[], pantry: Set<string>, opts: RecommendOptions = {}): Match[] {
  const minScore = opts.minScore ?? MIN_SCORE;
  return recipes
    .map((r) => scoreRecipe(r, pantry))
    .filter((m) => m.have.length > 0 && m.score >= minScore)
    .sort(byBestMatch)
    .slice(0, opts.maxResults ?? MAX_RESULTS);
}

/** Finds the one missing ingredient that would push the most recipes over the threshold. */
export function suggestIngredient(recipes: Recipe[], pantry: Set<string>, minScore = MIN_SCORE): Suggestion | undefined {
  const unlocks = new Map<string, number>();
  for (const recipe of recipes) {
    const base = scoreRecipe(recipe, pantry);
    if (base.have.length > 0 && base.score >= minScore) continue;
    for (const candidate of new Set(base.need)) {
      const withIt = scoreRecipe(recipe, new Set([...pantry, candidate]));
      if (withIt.score >= minScore) unlocks.set(candidate, (unlocks.get(candidate) ?? 0) + 1);
    }
  }
  let best: Suggestion | undefined;
  for (const [ingredient, count] of unlocks) {
    if (!best || count > best.unlocks || (count === best.unlocks && ingredient < best.ingredient)) {
      best = { ingredient, unlocks: count };
    }
  }
  return best;
}

export function recommend(pantryItems: string[], recipes: Recipe[], opts: RecommendOptions = {}): RecommendResult {
  const pantry = toPantrySet(pantryItems, opts.aliases);
  const matches = rankRecipes(recipes, pantry, opts);
  if (matches.length >= 2) return { matches };
  return { matches, suggestion: suggestIngredient(recipes, pantry, opts.minScore) };
}
