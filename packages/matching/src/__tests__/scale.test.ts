import { formatAmount, formatQuantity } from '../scale';

describe('formatQuantity', () => {
  it.each([
    [1, '1'],
    [0.5, '½'],
    [1.5, '1½'],
    [0.75, '¾'],
    [1 / 3, '⅓'],
    [2.95, '3'],
    [3.05, '3'],
  ])('%f → %s', (n, s) => expect(formatQuantity(n)).toBe(s));
});

describe('formatAmount', () => {
  it('scales a 1-person amount by the number of people', () => {
    expect(formatAmount(2, undefined, 2)).toBe('4');
    expect(formatAmount(1, 'slice', 1)).toBe('1 slice');
    expect(formatAmount(1, 'slice', 3)).toBe('3 slices');
    expect(formatAmount(0.5, 'cup', 3)).toBe('1½ cups');
    expect(formatAmount(1, 'tsp', 4)).toBe('4 tsp');
    expect(formatAmount(1, 'pinch', 2)).toBe('2 pinches');
  });

  it('shows the unit alone for to-taste items', () => {
    expect(formatAmount(undefined, 'pinch', 4)).toBe('pinch');
    expect(formatAmount(undefined, undefined, 4)).toBe('');
  });
});
