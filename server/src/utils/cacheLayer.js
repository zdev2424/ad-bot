/**
 * In-memory TTL Cache Layer
 * Provides ultra-low latency caching for high-frequency dashboard reads
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Sets a key with Time-To-Live in seconds (default 15s)
   */
  set(key, value, ttlSeconds = 15) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Gets a cached value if not expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Deletes a specific key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clears all cache entries
   */
  clear() {
    this.cache.clear();
  }
}

export const cacheLayer = new MemoryCache();
