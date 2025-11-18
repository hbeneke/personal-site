import { describe, it, expect } from "vitest";
import { calculatePagination, getPageRange } from "@/utils/pagination";

describe("paginationUtils", () => {
  describe("calculatePagination", () => {
    it("should calculate pagination for first page", () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result).toEqual({
        totalPages: 10,
        currentPage: 1,
        startIndex: 0,
        endIndex: 10,
        hasNextPage: true,
        hasPrevPage: false,
        pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    });

    it("should calculate pagination for middle page", () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 5,
      });

      expect(result).toEqual({
        totalPages: 10,
        currentPage: 5,
        startIndex: 40,
        endIndex: 50,
        hasNextPage: true,
        hasPrevPage: true,
        pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    });

    it("should calculate pagination for last page", () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 10,
      });

      expect(result).toEqual({
        totalPages: 10,
        currentPage: 10,
        startIndex: 90,
        endIndex: 100,
        hasNextPage: false,
        hasPrevPage: true,
        pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    });

    it("should handle partial last page", () => {
      const result = calculatePagination({
        totalItems: 95,
        itemsPerPage: 10,
        currentPage: 10,
      });

      expect(result).toEqual({
        totalPages: 10,
        currentPage: 10,
        startIndex: 90,
        endIndex: 95,
        hasNextPage: false,
        hasPrevPage: true,
        pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    });

    it("should default to page 1 when currentPage is omitted", () => {
      const result = calculatePagination({
        totalItems: 50,
        itemsPerPage: 10,
      });

      expect(result.currentPage).toBe(1);
      expect(result.startIndex).toBe(0);
      expect(result.hasPrevPage).toBe(false);
    });

    it("should handle invalid currentPage (too high)", () => {
      const result = calculatePagination({
        totalItems: 50,
        itemsPerPage: 10,
        currentPage: 100,
      });

      expect(result.currentPage).toBe(5); // Should default to last page
      expect(result.startIndex).toBe(40);
      expect(result.endIndex).toBe(50);
    });

    it("should handle invalid currentPage (too low)", () => {
      const result = calculatePagination({
        totalItems: 50,
        itemsPerPage: 10,
        currentPage: -5,
      });

      expect(result.currentPage).toBe(1); // Should default to first page
      expect(result.startIndex).toBe(0);
      expect(result.endIndex).toBe(10);
    });

    it("should handle single page of items", () => {
      const result = calculatePagination({
        totalItems: 5,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result).toEqual({
        totalPages: 1,
        currentPage: 1,
        startIndex: 0,
        endIndex: 5,
        hasNextPage: false,
        hasPrevPage: false,
        pages: [1],
      });
    });

    it("should handle zero items", () => {
      const result = calculatePagination({
        totalItems: 0,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result).toEqual({
        totalPages: 0,
        currentPage: 1,
        startIndex: 0,
        endIndex: 0,
        hasNextPage: false,
        hasPrevPage: false,
        pages: [],
      });
    });
  });

  describe("getPageRange", () => {
    it("should return all pages when total is less than maxVisible", () => {
      const result = getPageRange(3, 5);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return range with ellipsis for large page counts (beginning)", () => {
      const result = getPageRange(2, 20, 7);

      expect(result).toEqual([1, 2, 3, 4, 5, 6, null, 20]);
    });

    it("should return range with ellipsis for large page counts (middle)", () => {
      const result = getPageRange(10, 20, 7);

      expect(result).toEqual([1, null, 8, 9, 10, 11, 12, null, 20]);
    });

    it("should return range with ellipsis for large page counts (end)", () => {
      const result = getPageRange(19, 20, 7);

      expect(result).toEqual([1, null, 15, 16, 17, 18, 19, 20]);
    });

    it("should handle maxVisible parameter", () => {
      const result = getPageRange(5, 20, 5);

      expect(result).toHaveLength(7); // 1 + null + 3 pages + null + 20
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(20);
    });

    it("should handle single page", () => {
      const result = getPageRange(1, 1);

      expect(result).toEqual([1]);
    });

    it("should handle two pages", () => {
      const result = getPageRange(1, 2);

      expect(result).toEqual([1, 2]);
    });

    it("should show correct range at start with default maxVisible", () => {
      const result = getPageRange(1, 20);

      expect(result[0]).toBe(1);
      expect(result).toContain(null); // Should have ellipsis
      expect(result[result.length - 1]).toBe(20);
    });

    it("should show correct range at end with default maxVisible", () => {
      const result = getPageRange(20, 20);

      expect(result[0]).toBe(1);
      expect(result).toContain(null); // Should have ellipsis
      expect(result[result.length - 1]).toBe(20);
    });

    it("should not show ellipsis when pages fit exactly", () => {
      const result = getPageRange(4, 7, 7);

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(result).not.toContain(null);
    });

    it("should handle edge case near beginning", () => {
      const result = getPageRange(3, 20, 7);

      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result).toContain(null);
      expect(result[result.length - 1]).toBe(20);
    });

    it("should handle edge case near end", () => {
      const result = getPageRange(18, 20, 7);

      expect(result[0]).toBe(1);
      expect(result).toContain(null);
      expect(result[result.length - 1]).toBe(20);
      expect(result[result.length - 2]).toBe(19);
    });

    it("should handle totalPages = 1 correctly", () => {
      const result = getPageRange(1, 1);

      expect(result).toEqual([1]);
      expect(result).not.toContain(null);
    });

    it("should not add last page when totalPages <= 1", () => {
      const result = getPageRange(1, 1, 7);

      expect(result).toEqual([1]);
      expect(result.length).toBe(1);
    });

    it("should handle totalPages = 0", () => {
      const result = getPageRange(1, 0, 7);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});
