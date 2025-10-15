import type { PaginationConfig, PaginationResult } from "@/types/pagination.type";

export function calculatePagination(config: PaginationConfig): PaginationResult {
  const { totalItems, itemsPerPage, currentPage = 1 } = config;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const hasNextPage = validCurrentPage < totalPages;
  const hasPrevPage = validCurrentPage > 1;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return {
    totalPages,
    currentPage: validCurrentPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    pages,
  };
}

export function getPageRange(
  currentPage: number,
  totalPages: number,
  maxVisible = 7,
): (number | null)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: (number | null)[] = [];
  const leftSide = Math.floor((maxVisible - 3) / 2);
  const rightSide = Math.ceil((maxVisible - 3) / 2);

  range.push(1);
  let start = Math.max(2, currentPage - leftSide);
  let end = Math.min(totalPages - 1, currentPage + rightSide);

  if (currentPage <= leftSide + 2) {
    end = Math.min(maxVisible - 1, totalPages - 1);
    start = 2;
  }

  if (currentPage >= totalPages - rightSide - 1) {
    start = Math.max(2, totalPages - maxVisible + 2);
    end = totalPages - 1;
  }

  if (start > 2) {
    range.push(null);
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (end < totalPages - 1) {
    range.push(null);
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}
