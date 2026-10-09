import { normalizeIngredient, singularize } from '../normalize';

describe('singularize', () => {
  it.each([
    ['eggs', 'egg'],
    ['tomatoes', 'tomato'],
    ['potatoes', 'potato'],
    ['berries', 'berry'],
    ['peaches', 'peach'],
    ['onions', 'onion'],
    ['rice', 'rice'],
    ['hummus', 'hummus'],
    ['chives', 'chives'],
    ['glass', 'glass'],
  ])('%s → %s', (input, expected) => expect(singularize(input)).toBe(expected));
});

describe('normalizeIngredient', () => {
  it('lowercases, trims and singularizes the last word', () => {
    expect(normalizeIngredient('  Cherry Tomatoes ')).toBe('cherry tomato');
  });

  it('strips digits and punctuation people type', () => {
    expect(normalizeIngredient('2 eggs!')).toBe('egg');
  });

  it('applies aliases before and after singularizing', () => {
    const aliases = { scallion: 'spring onion', 'olive oil': 'oil' };
    expect(normalizeIngredient('Scallions', aliases)).toBe('spring onion');
    expect(normalizeIngredient('olive oil', aliases)).toBe('oil');
  });

  it('returns an empty string for blank input', () => {
    expect(normalizeIngredient('  !! ')).toBe('');
  });
});
