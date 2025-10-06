export interface PaginationSimpleRequestModel {
  pageSize: number;
  page: number;
  searchTerm: string;
}

export interface PaginationRequestModel extends PaginationSimpleRequestModel {
  sortByProperty: string;
  sortDirection: SortDirection;
  searchByProperties: string[];
  filters: PaginationFilter[];
}

export interface PaginationFilter {
  name: string;
  values: string[];
}

export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

export interface PaginationResponseModel<T> {
  totalEntries: number;
  entries: T[];
}
