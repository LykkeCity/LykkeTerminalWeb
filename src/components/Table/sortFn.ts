import {prop, sortBy, uniq} from 'rambda';
import {SortDirections} from '../../models';

export const sortData = (
  dataToSort: any[],
  sortByParam: string,
  sortDirectionDefault: string,
  state: any
) => {
  const sort = sortBy(prop(sortByParam));
  const sortDirection =
    state.sortByParam === sortByParam
      ? state.sortDirection === SortDirections.ASC
        ? SortDirections.DESC
        : SortDirections.ASC
      : sortDirectionDefault;
  const data = (() => {
    switch (sortDirection) {
      default:
      case SortDirections.ASC:
        return sort(dataToSort);
      case SortDirections.DESC:
        return sort(dataToSort).reverse();
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
