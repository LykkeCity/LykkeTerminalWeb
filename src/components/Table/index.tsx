export interface TableSortState {
  data: any[];
  sortByParam: string;
  sortDirection: string;
}

export interface TableNotSortState {
  data: any[];
}

export * from './styles';
export * from './sortFn';
export * from './TableHeader';
export * from './TableHeaderItem';
