import {sortData} from '.';

describe('sortFn', () => {
  it('should handle entries with noop data', () => {
    const data = [
      {id: 1, price: undefined},
      {id: 1, price: 2},
      {id: 1, price: undefined},
      {id: 1, price: 1},
      {id: 1, price: 3}
    ];

    const sorted = sortData(data, 'price', 'DESC', {sortByParam: 'DESC'})
      .data as any[];
    expect(sorted).toEqual([
      {id: 1, price: 3},
      {id: 1, price: 2},
      {id: 1, price: 1},
      {id: 1, price: undefined},
      {id: 1, price: undefined}
    ]);
    expect(sorted).toHaveLength(data.length);
    expect(sorted[0].price).toBe(3);
    expect(sorted[2].price).toBe(1);
  });
});
