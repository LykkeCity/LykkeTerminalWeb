import {compose, filter, prop, reject, sortBy, uniq} from 'rambda';
import {SortDirection} from '../../models';

const getSortDirection = (
  sortByParam: string,
  sortDirectionDefault: string,
  state?: any
) => {
  if (!state) {
    return sortDirectionDefault;
  }

  return state.sortByParam === sortByParam
    ? state.sortDirection === SortDirection.ASC
      ? SortDirection.DESC
      : SortDirection.ASC
    : sortDirectionDefault;
};

export const sortData = (
  dataToSort: any[],
  sortByParam: string,
  sortDirectionDefault: string,
  state?: any
) => {
  const byProp = prop(sortByParam); // eq to `x => x.sortByParam`
  const sort = compose(sortBy(byProp), filter(byProp));
  const noops = reject(byProp, dataToSort);
  const sortDirection = getSortDirection(
    sortByParam,
    sortDirectionDefault,
    state
  );
  const data = (() => {
    switch (sortDirection) {
      default:
      case SortDirection.ASC:
        return [...noops, ...sort(dataToSort)];
      case SortDirection.DESC:
        return [...sort(dataToSort).reverse(), ...noops];
    }
  })();

  return {
    data,
    sortByParam,
    sortDirection
  };
};

export const checkDataForSorting = (data: any[], sortByParam: string) => {
  const checkData: any[] = [];

  data.forEach(item => {
    if (item[sortByParam]) {
      checkData.push(item[sortByParam].toString());
    } else {
      checkData.push(false);
    }
  });

  return uniq(checkData).length === 1;
};
