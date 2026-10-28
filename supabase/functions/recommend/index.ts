// POST /functions/v1/recommend  { "pantry": ["eggs", "bread"] }
// Returns the top recipes for the pantry, using the same matching code as the app's offline mode.
import { createClient } from '@supabase/supabase-js';
import { RECIPE_SELECT, toAliases, toRecipe, type AliasRow, type Catalog, type RecipeRow } from './catalog.ts';
import { handle } from './handler.ts';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

// Content changes rarely, so each warm instance reuses it for a few minutes.
const CATALOG_TTL_MS = 5 * 60 * 1000;
let cached: { catalog: Catalog; at: number } | undefined;

async function loadCatalog(): Promise<Catalog> {
  if (cached && Date.now() - cached.at < CATALOG_TTL_MS) return cached.catalog;
  const [recipes, aliases] = await Promise.all([
    supabase.from('recipes').select(RECIPE_SELECT).eq('status', 'published'),
    supabase.from('ingredient_aliases').select('alias, ingredients(name)'),
  ]);
  if (recipes.error) throw recipes.error;
  if (aliases.error) throw aliases.error;
  const catalog = {
    recipes: (recipes.data as unknown as RecipeRow[]).map(toRecipe),
    aliases: toAliases(aliases.data as unknown as AliasRow[]),
  };
  cached = { catalog, at: Date.now() };
  return catalog;
}

Deno.serve((req) =>
  handle(req, {
    loadCatalog,
    logSearch: async (e) => {
      const { error } = await supabase
        .from('search_events')
        .insert({ pantry: e.pantry, result_count: e.resultCount, used_ai: e.usedAi });
      if (error) throw error;
    },
  }),
);
