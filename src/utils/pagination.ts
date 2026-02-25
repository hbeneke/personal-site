import type { PaginationConfig, PaginationResult } from "@/types/pagination.type";

/**
 * Computes all pagination metadata from a total item count, page size, and optional current page.
 *
 * Clamps the current page to the valid range [1, totalPages] and derives the
 * start/end item indices, navigation flags, and the full sequential page list.
 *
 * @param config.currentPage - Defaults to 1 if omitted.
 */
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

/**
 * Generates a compact, windowed list of page numbers for a pagination control.
 *
 * When `totalPages` exceeds `maxVisible`, applies a sliding-window algorithm that
 * always anchors the first and last page. Gaps are represented as `null` (rendered
 * as "…"). The window shifts based on the current page position:
 * - Near the start → anchors left
 * - In the middle → centred on current page
 * - Near the end → anchors right
 *
 * Example outputs for `totalPages = 10`, `maxVisible = 7`:
 * ```
 * currentPage = 1  → [1, 2, 3, 4, 5, null, 10]
 * currentPage = 5  → [1, null, 4, 5, 6, null, 10]
 * currentPage = 10 → [1, null, 6, 7, 8, 9, 10]
 * ```
 *
 * @param maxVisible - Maximum slots in the output including ellipsis. Defaults to 7.
 * @returns Page numbers interspersed with `null` values representing ellipsis gaps.
 */
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
