interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const CACHE_TTL_SECONDS = CACHE_TTL / 1000;

/**
 * Retrieves a cached value or fetches it fresh if the cache is expired or missing.
 *
 * If a cached entry exists and its age is within the TTL window, it is returned
 * immediately without calling the fetcher. Otherwise the fetcher is called, the
 * result is stored with the current timestamp, and the fresh value is returned.
 *
 * @param key - Unique cache key used to identify the stored entry.
 * @param fetcher - Async function that retrieves fresh data on a cache miss.
 * @returns A promise that resolves to the cached or freshly fetched value.
 */
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

/**
 * Removes one or all entries from the in-memory cache.
 *
 * @param key - If provided, only this entry is removed. If omitted, the entire cache is cleared.
 */
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
