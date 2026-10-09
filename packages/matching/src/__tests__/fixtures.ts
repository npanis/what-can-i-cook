import type { Recipe } from '../types';

const r = (slug: string, minutes: number, ingredients: Recipe['ingredients']): Recipe => ({
  slug,
  title: slug.replace(/-/g, ' '),
  minutes,
  difficulty: 'easy',
  ingredients,
  steps: [],
});

export const RECIPES: Recipe[] = [
  r('soft-boiled-eggs-with-toast', 10, [
    { ingredient: 'egg', amount: 2 },
    { ingredient: 'bread', amount: 1, unit: 'slice' },
    { ingredient: 'butter', amount: 1, unit: 'tsp' },
    { ingredient: 'salt' },
  ]),
  r('egg-in-a-hole', 8, [
    { ingredient: 'egg', amount: 1 },
    { ingredient: 'bread', amount: 1, unit: 'slice' },
    { ingredient: 'butter', amount: 1, unit: 'tsp' },
    { ingredient: 'chives', optional: true },
  ]),
  r('cheese-omelette', 12, [
    { ingredient: 'egg', amount: 2 },
    { ingredient: 'cheddar', amount: 30, unit: 'g' },
    { ingredient: 'butter', amount: 1, unit: 'tsp' },
    { ingredient: 'black pepper' },
  ]),
  r('fried-rice', 20, [
    { ingredient: 'rice', amount: 1, unit: 'cup' },
    { ingredient: 'egg', amount: 1 },
    { ingredient: 'onion', amount: 0.5 },
    { ingredient: 'soy sauce', amount: 1, unit: 'tbsp' },
    { ingredient: 'oil' },
  ]),
  r('tomato-pasta', 25, [
    { ingredient: 'pasta', amount: 100, unit: 'g' },
    { ingredient: 'tomato', amount: 2 },
    { ingredient: 'garlic', amount: 1, unit: 'clove' },
    { ingredient: 'oil' },
  ]),
];
