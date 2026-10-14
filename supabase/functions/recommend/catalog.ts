import type { AliasMap, Recipe } from '@wcic/matching';

/** Row shapes returned by the nested select in loadCatalog. */
export interface RecipeRow {
  slug: string;
  title: string;
  minutes: number;
  difficulty: Recipe['difficulty'];
  recipe_ingredients: {
    position: number;
    amount: number | string | null;
    unit: string | null;
    optional: boolean;
    ingredients: { name: string } | null;
  }[];
  recipe_steps: { position: number; text: string }[];
}

export interface AliasRow {
  alias: string;
  ingredients: { name: string } | null;
}

export interface Catalog {
  recipes: Recipe[];
  aliases: AliasMap;
}

export const RECIPE_SELECT =
  'slug, title, minutes, difficulty, recipe_ingredients(position, amount, unit, optional, ingredients(name)), recipe_steps(position, text)';

export function toRecipe(row: RecipeRow): Recipe {
  return {
    slug: row.slug,
    title: row.title,
    minutes: row.minutes,
    difficulty: row.difficulty,
    ingredients: [...row.recipe_ingredients]
      .sort((a, b) => a.position - b.position)
      .filter((i) => i.ingredients)
      .map((i) => ({
        ingredient: i.ingredients!.name,
        // Postgres numeric arrives as a string.
        ...(i.amount !== null && { amount: Number(i.amount) }),
        ...(i.unit !== null && { unit: i.unit }),
        ...(i.optional && { optional: true }),
      })),
    steps: [...row.recipe_steps].sort((a, b) => a.position - b.position).map((s) => s.text),
  };
}

export function toAliases(rows: AliasRow[]): AliasMap {
  return Object.fromEntries(rows.filter((r) => r.ingredients).map((r) => [r.alias, r.ingredients!.name]));
}
