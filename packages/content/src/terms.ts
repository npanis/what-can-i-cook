export interface Term {
  slug: string;
  name: string;
  partOfSpeech: 'verb' | 'noun' | 'adjective';
  /** One or two sentences shown inside the step. */
  shortDefinition: string;
  /** Shown on the full term guide. */
  fullDefinition: string;
  guideTitle?: string;
  guide?: { label: string; result: string }[];
  related: string[];
}

export const TERMS: Term[] = [
  {
    slug: 'soft-boil',
    name: 'Soft-boil',
    partOfSpeech: 'verb',
    shortDefinition:
      'Cook an egg in its shell just long enough for the white to set while the yolk stays runny. Usually 5 to 7 minutes in boiling water.',
    fullDefinition:
      'Cooking an egg in its shell for a short time, so the white turns firm but the yolk stays runny. It is a hard-boiled egg that you take out early on purpose.',
    guideTitle: 'Timing guide, large egg from the fridge',
    guide: [
      { label: '4 min', result: 'Very runny yolk, soft white' },
      { label: '6 min', result: 'Runny yolk, set white' },
      { label: '8 min', result: 'Jammy, mostly set yolk' },
      { label: '10+ min', result: 'Hard-boiled, firm yolk' },
    ],
    related: ['rolling-boil'],
  },
  {
    slug: 'rolling-boil',
    name: 'Rolling boil',
    partOfSpeech: 'noun',
    shortDefinition:
      'Big bubbles that keep breaking the surface, even when you stir. Hotter and more vigorous than a simmer.',
    fullDefinition:
      'Water heated until large bubbles rise and break the surface constantly, and stirring does not stop them. Use it when a recipe needs the water as hot as it gets.',
    related: ['simmer', 'soft-boil'],
  },
  {
    slug: 'simmer',
    name: 'Simmer',
    partOfSpeech: 'verb',
    shortDefinition: 'Cook in liquid with small, gentle bubbles just breaking the surface. Lower heat than a boil.',
    fullDefinition:
      'Keeping a liquid just below boiling, with a few small bubbles rising now and then. It cooks food gently so it stays tender and sauces do not burn.',
    related: ['rolling-boil'],
  },
  {
    slug: 'whisk',
    name: 'Whisk',
    partOfSpeech: 'verb',
    shortDefinition: 'Beat quickly with a whisk or fork until fully mixed and a little frothy.',
    fullDefinition:
      'Stirring fast in small circles with a whisk or fork to blend ingredients and add a little air. For eggs, whisk until no streaks of white are left.',
    related: [],
  },
  {
    slug: 'golden',
    name: 'Golden',
    partOfSpeech: 'adjective',
    shortDefinition: 'Cooked until light brown on the outside, like toast. Not dark brown.',
    fullDefinition:
      'The light brown color food turns when it is fried or toasted. It means the outside is crisp and cooked, but it has not started to burn.',
    related: [],
  },
];
