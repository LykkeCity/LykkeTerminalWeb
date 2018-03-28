export interface TableSortState {
  data: any[];
  sortByParam: string;
  sortDirection: string;
}

export * from './styles';
export {sortData} from './sortFn';
export {default as TableHeader} from './TableHeader';
export {default as Table} from './Table';
