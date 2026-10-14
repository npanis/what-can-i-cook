export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RecipeIngredient {
  /** Canonical ingredient name, e.g. "egg". */
  ingredient: string;
  /** Amount for 1 person. Omitted for "to taste" items. */
  amount?: number;
  /** Singular unit, e.g. "slice", "tsp". Omitted for countable items like eggs. */
  unit?: string;
  /** Optional items are shown but never lower the match score. */
  optional?: boolean;
}

export interface Recipe {
  slug: string;
  title: string;
  minutes: number;
  difficulty: Difficulty;
  ingredients: RecipeIngredient[];
  /** Step text. Cooking terms are marked as [[term-slug|shown text]] or [[term-slug]]. */
  steps: string[];
}

export interface Match {
  recipe: Recipe;
  /** Share of required (non-optional, non-staple) ingredients in the pantry, 0 to 1. */
  score: number;
  have: string[];
  need: string[];
  optionalMissing: string[];
}

export interface Suggestion {
  ingredient: string;
  unlocks: number;
}

export interface RecommendResult {
  matches: Match[];
  /** Set when fewer than 2 recipes match: the one item that would unlock the most recipes. */
  suggestion?: Suggestion;
}
