import { parseStep } from '../terms';

describe('parseStep', () => {
  it('splits text and term markup', () => {
    expect(parseStep('[[soft-boil|Soft-boil]] the eggs for 6 minutes.')).toEqual([
      { kind: 'term', slug: 'soft-boil', text: 'Soft-boil' },
      { kind: 'text', text: ' the eggs for 6 minutes.' },
    ]);
  });

  it('uses the slug as the shown text when none is given', () => {
    expect(parseStep('Gently [[fold]] in.')).toEqual([
      { kind: 'text', text: 'Gently ' },
      { kind: 'term', slug: 'fold', text: 'fold' },
      { kind: 'text', text: ' in.' },
    ]);
  });

  it('returns one text part when there are no terms', () => {
    expect(parseStep('Serve.')).toEqual([{ kind: 'text', text: 'Serve.' }]);
  });
});
