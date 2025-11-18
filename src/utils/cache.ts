interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_TTL = 1000 * 60 * 5;

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
