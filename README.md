# What Can I Cook?

Tell the app what is left in your pantry and it suggests the 2 to 3 best recipes you can make, what else you would need, and how to cook them step by step, with cooking terms explained inside each step.

Phase 1 targets iOS first, built with Expo so Android and web can follow.

## Layout

| Path | What it is |
| --- | --- |
| `apps/mobile` | Expo app (TypeScript, Expo Router). Four screens: Pantry, Top recipes, Recipe steps, Cooking term. |
| `packages/matching` | Pantry-to-recipe matching, amount scaling and step-term parsing. Shared by the app (offline) and the backend. |
| `packages/content` | Starter recipes (written for 1 person) and cooking terms. |
| `supabase` | Database schema, and `seed.sql` generated from `packages/content`. |

## Getting started

```bash
npm install
npm test             # unit tests for matching and content
npm run typecheck
cd apps/mobile && npx expo start   # then press i for the iOS simulator, or scan with Expo Go
```

After changing recipes or terms, regenerate the seed: `npm run seed:sql -w @wcic/content`.

## Product decisions (Phase 1)

- Pantry takes names only, no amounts. Salt, black pepper and oil are assumed.
- Recipes are written for 1 person; "Cooking for" (1 to 6) scales every amount.
- A recipe matches when the pantry has at least 60% of its required ingredients. Optional items never lower the score.
- "I cooked this" saves to a history on the phone, with no account.
- No expiry tracking in Phase 1. Dietary filters come in Phase 2.
