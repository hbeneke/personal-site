/**
 * Sistema de caché simple para optimizar llamadas repetidas a getCollection()
 *
 * En Astro, durante el build, múltiples páginas pueden solicitar las mismas colecciones
 * repetidamente. Este caché evita operaciones redundantes de I/O y parsing.
 *
 * @example
 * ```typescript
 * // En lugar de:
 * const posts = await getCollection("posts");
 *
 * // Usar:
 * const posts = await getCached('posts-collection', () => getCollection("posts"));
 * ```
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Almacén de caché en memoria
 * Key: identificador único de la operación
 * Value: datos cacheados + timestamp
 */
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * TTL (Time To Live) del caché en milisegundos
 * 5 minutos es suficiente para el build time
 * Durante el build, las colecciones no cambian, así que podemos cachear agresivamente
 */
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

/**
 * Obtiene datos de caché o ejecuta el fetcher si no existe/expiró
 *
 * @template T - Tipo de dato a cachear
 * @param key - Identificador único para esta operación de caché
 * @param fetcher - Función async que obtiene los datos si no están en caché
 * @returns Promise con los datos (desde caché o fetcher)
 *
 * @example
 * ```typescript
 * const posts = await getCached('posts-all', async () => {
 *   const collection = await getCollection("posts");
 *   return collection.filter(p => !p.data.draft);
 * });
 * ```
 */
export function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  // Cache hit: datos existen y no han expirado
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return Promise.resolve(cached.data as T);
  }

  // Cache miss o expirado: ejecutar fetcher y cachear resultado
  return fetcher().then((data) => {
    cache.set(key, {
      data,
      timestamp: now,
    });
    return data;
  });
}

/**
 * Limpia el caché
 *
 * @param key - Opcional. Si se proporciona, solo limpia esa entrada.
 *              Si no se proporciona, limpia todo el caché.
 *
 * @example
 * ```typescript
 * // Limpiar entrada específica
 * clearCache('posts-all');
 *
 * // Limpiar todo
 * clearCache();
 * ```
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Obtiene estadísticas del caché (útil para debugging)
 *
 * @returns Objeto con estadísticas del caché
 */
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
      age: Math.floor((now - value.timestamp) / 1000), // edad en segundos
    });
  }

  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    entries,
  };
}
