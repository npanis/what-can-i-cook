import { RECIPES } from '@wcic/content';
import { recommend, type Recipe, type RecommendResult } from '@wcic/matching';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const TIMEOUT_MS = 6000;

/** Recipes seen in server results, so the recipe screen can open ones that are not bundled. */
const seen = new Map<string, Recipe>();

export function findRecipe(slug: string): Recipe | undefined {
  return seen.get(slug) ?? RECIPES.find((r) => r.slug === slug);
}

/** Matches against the recipes bundled in the app. Works offline. */
export function recommendOffline(pantry: string[]): RecommendResult {
  return recommend(pantry, RECIPES);
}

export const isServerConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Asks the recommend function. Throws when it is not configured, times out or fails. */
export async function recommendOnline(pantry: string[], signal?: AbortSignal): Promise<RecommendResult> {
  if (!isServerConfigured) throw new Error('Recipe server is not configured.');
  // Hermes lacks AbortSignal.timeout and AbortSignal.any, so combine them by hand.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY! },
      body: JSON.stringify({ pantry }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`recommend failed with ${res.status}`);
  const result = (await res.json()) as RecommendResult;
  for (const m of result.matches) seen.set(m.recipe.slug, m.recipe);
  return result;
}
