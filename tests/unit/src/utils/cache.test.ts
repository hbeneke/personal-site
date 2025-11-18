import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCache, getCached, getCacheStats } from "@/utils/cache";

describe("Cache System", () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCache();
  });

  afterEach(() => {
    // Clean up after each test to avoid side effects
    clearCache();
    vi.clearAllTimers();
  });

  describe("getCached", () => {
    it("should call fetcher on first access (cache miss)", async () => {
      const fetcher = vi.fn(async () => "test data");

      const result = await getCached("test-key", fetcher);

      expect(result).toBe("test data");
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("should return cached data on second access (cache hit)", async () => {
      const fetcher = vi.fn(async () => "test data");

      // First call - cache miss
      const result1 = await getCached("test-key", fetcher);
      expect(result1).toBe("test data");
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Second call - cache hit
      const result2 = await getCached("test-key", fetcher);
      expect(result2).toBe("test data");
      expect(fetcher).toHaveBeenCalledTimes(1); // Not called again
    });

    it("should handle different keys independently", async () => {
      const fetcher1 = vi.fn(async () => "data 1");
      const fetcher2 = vi.fn(async () => "data 2");

      const result1 = await getCached("key-1", fetcher1);
      const result2 = await getCached("key-2", fetcher2);

      expect(result1).toBe("data 1");
      expect(result2).toBe("data 2");
      expect(fetcher1).toHaveBeenCalledTimes(1);
      expect(fetcher2).toHaveBeenCalledTimes(1);
    });

    it("should cache complex objects", async () => {
      const complexData = {
        id: 1,
        name: "Test Post",
        tags: ["typescript", "testing"],
        metadata: {
          author: "John Doe",
          date: new Date("2025-01-01"),
        },
      };

      const fetcher = vi.fn(async () => complexData);

      const result1 = await getCached("complex-key", fetcher);
      const result2 = await getCached("complex-key", fetcher);

      expect(result1).toEqual(complexData);
      expect(result2).toEqual(complexData);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("should cache arrays", async () => {
      const arrayData = [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
        { id: 3, title: "Post 3" },
      ];

      const fetcher = vi.fn(async () => arrayData);

      const result1 = await getCached("array-key", fetcher);
      const result2 = await getCached("array-key", fetcher);

      expect(result1).toEqual(arrayData);
      expect(result2).toEqual(arrayData);
      expect(result1).toHaveLength(3);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("should handle async fetchers correctly", async () => {
      const fetcher = vi.fn(async () => {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "async data";
      });

      const result = await getCached("async-key", fetcher);

      expect(result).toBe("async data");
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("should handle fetcher errors gracefully", async () => {
      const error = new Error("Fetcher failed");
      const fetcher = vi.fn(async () => {
        throw error;
      });

      await expect(getCached("error-key", fetcher)).rejects.toThrow("Fetcher failed");
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("should not cache failed fetches", async () => {
      let callCount = 0;
      const fetcher = vi.fn(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("First call fails");
        }
        return "success";
      });

      // First call fails
      await expect(getCached("retry-key", fetcher)).rejects.toThrow("First call fails");

      // Second call should retry (don't cache error)
      const result = await getCached("retry-key", fetcher);
      expect(result).toBe("success");
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  describe("clearCache", () => {
    it("should clear specific cache entry", async () => {
      const fetcher = vi.fn(async () => "test data");

      // Cache data
      await getCached("test-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Clear specific cache entry
      clearCache("test-key");

      // Next call should execute fetcher again
      await getCached("test-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("should clear all cache entries when no key provided", async () => {
      const fetcher1 = vi.fn(async () => "data 1");
      const fetcher2 = vi.fn(async () => "data 2");

      // Cache multiple data
      await getCached("key-1", fetcher1);
      await getCached("key-2", fetcher2);

      expect(fetcher1).toHaveBeenCalledTimes(1);
      expect(fetcher2).toHaveBeenCalledTimes(1);

      // Clear all cache
      clearCache();

      // Both fetchers should execute again
      await getCached("key-1", fetcher1);
      await getCached("key-2", fetcher2);

      expect(fetcher1).toHaveBeenCalledTimes(2);
      expect(fetcher2).toHaveBeenCalledTimes(2);
    });

    it("should not affect other keys when clearing specific key", async () => {
      const fetcher1 = vi.fn(async () => "data 1");
      const fetcher2 = vi.fn(async () => "data 2");

      await getCached("key-1", fetcher1);
      await getCached("key-2", fetcher2);

      // Clear only key-1
      clearCache("key-1");

      // key-1 should call fetcher again
      await getCached("key-1", fetcher1);
      expect(fetcher1).toHaveBeenCalledTimes(2);

      // key-2 should remain cached
      await getCached("key-2", fetcher2);
      expect(fetcher2).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCacheStats", () => {
    it("should return empty stats for empty cache", () => {
      const stats = getCacheStats();

      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
      expect(stats.entries).toEqual([]);
    });

    it("should return correct size", async () => {
      await getCached("key-1", async () => "data 1");
      await getCached("key-2", async () => "data 2");
      await getCached("key-3", async () => "data 3");

      const stats = getCacheStats();

      expect(stats.size).toBe(3);
    });

    it("should return all cache keys", async () => {
      await getCached("posts-collection", async () => []);
      await getCached("notes-collection", async () => []);
      await getCached("tags-collection", async () => []);

      const stats = getCacheStats();

      expect(stats.keys).toContain("posts-collection");
      expect(stats.keys).toContain("notes-collection");
      expect(stats.keys).toContain("tags-collection");
      expect(stats.keys).toHaveLength(3);
    });

    it("should return entry age in seconds", async () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      await getCached("test-key", async () => "data");

      // Advance 5 seconds
      vi.setSystemTime(now + 5000);

      const stats = getCacheStats();

      expect(stats.entries).toHaveLength(1);
      expect(stats.entries[0].key).toBe("test-key");
      expect(stats.entries[0].age).toBe(5); // 5 seconds

      vi.useRealTimers();
    });

    it("should track multiple entries with their ages", async () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      await getCached("key-1", async () => "data 1");

      vi.setSystemTime(now + 2000); // +2s
      await getCached("key-2", async () => "data 2");

      vi.setSystemTime(now + 5000); // +5s
      await getCached("key-3", async () => "data 3");

      vi.setSystemTime(now + 10000); // +10s

      const stats = getCacheStats();

      expect(stats.size).toBe(3);
      expect(stats.entries).toHaveLength(3);

      // Verify approximate ages
      const key1Entry = stats.entries.find((e) => e.key === "key-1");
      const key2Entry = stats.entries.find((e) => e.key === "key-2");
      const key3Entry = stats.entries.find((e) => e.key === "key-3");

      expect(key1Entry?.age).toBe(10); // 10s since creation
      expect(key2Entry?.age).toBe(8); // 8s since creation
      expect(key3Entry?.age).toBe(5); // 5s since creation

      vi.useRealTimers();
    });
  });

  describe("Cache TTL", () => {
    it("should respect TTL and refetch after expiration", async () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      const fetcher = vi.fn(async () => "data");

      // First call
      await getCached("ttl-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Advance 4 minutes (less than 5-minute TTL)
      vi.setSystemTime(now + 4 * 60 * 1000);
      await getCached("ttl-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(1); // Still cached

      // Advance 6 minutes (more than TTL)
      vi.setSystemTime(now + 6 * 60 * 1000);
      await getCached("ttl-key", fetcher);
      expect(fetcher).toHaveBeenCalledTimes(2); // Expired, refetch

      vi.useRealTimers();
    });
  });

  describe("Type Safety", () => {
    it("should maintain type safety with TypeScript", async () => {
      interface Post {
        id: number;
        title: string;
        tags: string[];
      }

      const posts: Post[] = [
        { id: 1, title: "Post 1", tags: ["tag1"] },
        { id: 2, title: "Post 2", tags: ["tag2"] },
      ];

      const fetcher = async (): Promise<Post[]> => posts;

      const result = await getCached<Post[]>("typed-key", fetcher);

      // TypeScript should infer the type correctly
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Post 1");
      expect(result[0].tags).toContain("tag1");
    });
  });
});
