export interface PaginationConfig {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
}

export interface PaginationResult {
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pages: number[];
}

export interface PaginationProps {
  itemsPerPage?: number;
  itemLabel?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}
