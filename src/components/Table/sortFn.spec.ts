import {sortData} from '.';

const getTestData = () => {
  return [
    {id: 1, price: undefined},
    {id: 1, price: 2},
    {id: 1, price: undefined},
    {id: 1, price: 1},
    {id: 1, price: 3}
  ];
};

describe('sortFn', () => {
  it('should handle entries with noop data', () => {
    const data = getTestData();
    const sortedData = sortData(data, 'price', 'DESC', {sortByParam: 'DESC'})
      .data as any[];

    expect(sortedData).toEqual([
      {id: 1, price: 3},
      {id: 1, price: 2},
      {id: 1, price: 1},
      {id: 1, price: undefined},
      {id: 1, price: undefined}
    ]);
    expect(sortedData).toHaveLength(data.length);
    expect(sortedData[0].price).toBe(3);
    expect(sortedData[2].price).toBe(1);
  });

  it('should sort data by passed direction if state not passed as parameter', () => {
    const data = getTestData();
    const sortedData = sortData(data, 'price', 'ASC').data as any[];

    expect(sortedData).toEqual([
      {id: 1, price: undefined},
      {id: 1, price: undefined},
      {id: 1, price: 1},
      {id: 1, price: 2},
      {id: 1, price: 3}
    ]);
  });
});
