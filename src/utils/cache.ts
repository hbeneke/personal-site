interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Cache Time-To-Live in milliseconds
 * Default: 5 minutes (300,000 ms)
 *
 * This determines how long cached data remains valid before being refetched.
 * Adjust this value based on your data freshness requirements:
 * - Lower values: More frequent updates, higher load
 * - Higher values: Better performance, potentially stale data
 */
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cache TTL in seconds for external use
 */
export const CACHE_TTL_SECONDS = CACHE_TTL / 1000;

export function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return Promise.resolve(cached.data as T);
  }

  return fetcher().then((data) => {
    cache.set(key, {
      data,
      timestamp: now,
    });
    return data;
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function getCacheStats(): {
  size: number;
  keys: string[];
  entries: Array<{ key: string; age: number }>;
} {
  const now = Date.now();
  const entries: Array<{ key: string; age: number }> = [];

  for (const [key, value] of cache.entries()) {
    entries.push({
      key,
      age: Math.floor((now - value.timestamp) / 1000),
    });
  }

  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    entries,
  };
}
