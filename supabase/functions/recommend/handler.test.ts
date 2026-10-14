import { assertEquals } from '@std/assert';
import { RECIPES } from '../../../packages/content/src/recipes.ts';
import { toAliases, toRecipe, type RecipeRow } from './catalog.ts';
import { handle, type Deps, type SearchEvent } from './handler.ts';

function deps(logged: SearchEvent[] = [], overrides: Partial<Deps> = {}): Deps {
  return {
    loadCatalog: () => Promise.resolve({ recipes: RECIPES, aliases: { scallion: 'spring onion' } }),
    logSearch: (e) => {
      logged.push(e);
      return Promise.resolve();
    },
    ...overrides,
  };
}

const post = (body: unknown) =>
  new Request('http://localhost/recommend', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });

Deno.test('returns the top 3 for a pantry and logs the search', async () => {
  const logged: SearchEvent[] = [];
  const res = await handle(post({ pantry: ['Eggs', 'bread', 'butter', 'cheddar'] }), deps(logged));
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(
    body.matches.map((m: { recipe: { slug: string } }) => m.recipe.slug),
    ['cheesy-scrambled-eggs-on-toast', 'soft-boiled-eggs-with-toast-soldiers', 'egg-in-a-hole'],
  );
  assertEquals(logged, [{ pantry: ['egg', 'bread', 'butter', 'cheddar'], resultCount: 3, usedAi: false }]);
});

Deno.test('suggests one item when nothing matches', async () => {
  const body = await (await handle(post({ pantry: ['eggs'] }), deps())).json();
  assertEquals(body.matches, []);
  assertEquals(body.suggestion, { ingredient: 'bread', unlocks: 2 });
});

Deno.test('rejects bad input with 400', async () => {
  for (const bad of ['not json', { pantry: 'eggs' }, { pantry: [1] }, { pantry: Array(51).fill('egg') }, {
    pantry: ['x'.repeat(61)],
  }]) {
    assertEquals((await handle(post(bad), deps())).status, 400, JSON.stringify(bad));
  }
});

Deno.test('only accepts POST, and answers CORS preflight', async () => {
  assertEquals((await handle(new Request('http://localhost/recommend'), deps())).status, 405);
  const pre = await handle(new Request('http://localhost/recommend', { method: 'OPTIONS' }), deps());
  assertEquals(pre.status, 200);
  assertEquals(pre.headers.get('Access-Control-Allow-Origin'), '*');
});

Deno.test('still answers when logging fails', async () => {
  const res = await handle(post({ pantry: ['eggs', 'bread', 'butter'] }), deps([], { logSearch: () => Promise.reject(new Error('down')) }));
  assertEquals(res.status, 200);
});

Deno.test('returns 503 when recipes cannot be loaded', async () => {
  const res = await handle(post({ pantry: ['eggs'] }), deps([], { loadCatalog: () => Promise.reject(new Error('db down')) }));
  assertEquals(res.status, 503);
});

Deno.test('maps database rows to recipes in order, with numeric amounts', () => {
  const row: RecipeRow = {
    slug: 's',
    title: 'S',
    minutes: 5,
    difficulty: 'easy',
    recipe_ingredients: [
      { position: 2, amount: null, unit: 'pinch', optional: false, ingredients: { name: 'salt' } },
      { position: 1, amount: '0.5', unit: 'cup', optional: true, ingredients: { name: 'rice' } },
    ],
    recipe_steps: [
      { position: 2, text: 'Two' },
      { position: 1, text: 'One' },
    ],
  };
  assertEquals(toRecipe(row), {
    slug: 's',
    title: 'S',
    minutes: 5,
    difficulty: 'easy',
    ingredients: [
      { ingredient: 'rice', amount: 0.5, unit: 'cup', optional: true },
      { ingredient: 'salt', unit: 'pinch' },
    ],
    steps: ['One', 'Two'],
  });
  assertEquals(toAliases([{ alias: 'olive oil', ingredients: { name: 'oil' } }, { alias: 'x', ingredients: null }]), {
    'olive oil': 'oil',
  });
});
