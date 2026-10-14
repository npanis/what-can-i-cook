import { recommend, toPantrySet } from '@wcic/matching';
import type { Catalog } from './catalog.ts';

export const MAX_ITEMS = 50;
export const MAX_ITEM_LENGTH = 60;

export interface SearchEvent {
  pantry: string[];
  resultCount: number;
  usedAi: boolean;
}

export interface Deps {
  loadCatalog: () => Promise<Catalog>;
  logSearch: (event: SearchEvent) => Promise<void>;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

/** Returns the pantry list, or an error message when the body is not { pantry: string[] }. */
export function parsePantry(body: unknown): string[] | string {
  const pantry = (body as { pantry?: unknown } | null)?.pantry;
  if (!Array.isArray(pantry)) return 'Expected { "pantry": ["eggs", "bread"] }.';
  if (pantry.length > MAX_ITEMS) return `Send at most ${MAX_ITEMS} pantry items.`;
  if (!pantry.every((p) => typeof p === 'string' && p.length <= MAX_ITEM_LENGTH)) {
    return `Pantry items must be text of at most ${MAX_ITEM_LENGTH} characters.`;
  }
  return pantry;
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Body must be JSON.' }, 400);
  }
  const pantry = parsePantry(body);
  if (typeof pantry === 'string') return json({ error: pantry }, 400);

  let catalog: Catalog;
  try {
    catalog = await deps.loadCatalog();
  } catch (err) {
    console.error('catalog load failed', err);
    return json({ error: 'Recipes are unavailable right now.' }, 503);
  }
  const { recipes, aliases } = catalog;
  const result = recommend(pantry, recipes, { aliases });

  // Logging must never cost the person their answer.
  try {
    await deps.logSearch({
      pantry: [...toPantrySet(pantry, aliases)],
      resultCount: result.matches.length,
      usedAi: false,
    });
  } catch (err) {
    console.error('search_events insert failed', err);
  }

  return json(result);
}
