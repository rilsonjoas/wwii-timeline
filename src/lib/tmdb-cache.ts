import type { EnrichedMovieData } from './tmdb';

interface CacheEntry {
  data: EnrichedMovieData;
  timestamp: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class TMDBCache {
  private readonly CACHE_PREFIX = 'tmdb_cache_';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private stats = {
    hits: 0,
    misses: 0
  };

  /**
   * Generate cache key from movie title and year
   */
  private getCacheKey(title: string, year?: number, director?: string): string {
    const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, '').trim();
    return `${this.CACHE_PREFIX}${normalizedTitle}_${year || 'unknown'}_${director || 'unknown'}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private isValidEntry(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < this.CACHE_DURATION;
  }

  /**
   * Get cached movie data
   */
  get(title: string, year?: number, director?: string): EnrichedMovieData | null {
    try {
      const key = this.getCacheKey(title, year, director);
      const cached = localStorage.getItem(key);
      
      if (!cached) {
        this.stats.misses++;
        return null;
      }

      const entry: CacheEntry = JSON.parse(cached);
      
      if (!this.isValidEntry(entry)) {
        // Remove expired entry
        localStorage.removeItem(key);
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      console.log(`🎯 Cache HIT for: ${title} (${year})`);
      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Store movie data in cache
   */
  set(title: string, data: EnrichedMovieData, year?: number, director?: string): void {
    try {
      const key = this.getCacheKey(title, year, director);
      const entry: CacheEntry = {
        data,
        timestamp: Date.now()
      };

      localStorage.setItem(key, JSON.stringify(entry));
      console.log(`💾 Cached: ${title} (${year})`);
    } catch (error) {
      console.error('Cache set error:', error);
      // If localStorage is full, try to clear old entries
      this.cleanup();
    }
  }

  /**
   * Remove expired entries from cache
   */
  cleanup(): void {
    try {
      console.log('🧹 Cleaning up TMDB cache...');
      let removedCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key?.startsWith(this.CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const entry: CacheEntry = JSON.parse(cached);
              if (!this.isValidEntry(entry)) {
                localStorage.removeItem(key);
                removedCount++;
                i--; // Adjust index since we removed an item
              }
            } catch {
              // Remove invalid entries
              localStorage.removeItem(key);
              removedCount++;
              i--;
            }
          }
        }
      }

      console.log(`🗑️ Removed ${removedCount} expired cache entries`);
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  /**
   * Clear all TMDB cache entries
   */
  clear(): void {
    try {
      console.log('🧹 Clearing all TMDB cache...');
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reset stats
      this.stats = { hits: 0, misses: 0 };
      
      console.log(`🗑️ Cleared ${keysToRemove.length} cache entries`);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? Math.round((this.stats.hits / totalRequests) * 100) : 0;
    
    // Count current cache size
    let size = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          size++;
        }
      }
    } catch (error) {
      console.error('Error counting cache size:', error);
    }

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size,
      hitRate
    };
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSizeBytes(): number {
    try {
      let totalSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }

      return totalSize * 2; // Approximate size in bytes (UTF-16)
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  /**
   * Log cache statistics
   */
  logStats(): void {
    const stats = this.getStats();
    const sizeBytes = this.getSizeBytes();
    const sizeKB = Math.round(sizeBytes / 1024);

    console.log('📊 === TMDB CACHE STATS ===');
    console.log(`💾 Cache hits: ${stats.hits}`);
    console.log(`❌ Cache misses: ${stats.misses}`);
    console.log(`📈 Hit rate: ${stats.hitRate}%`);
    console.log(`📦 Entries: ${stats.size}`);
    console.log(`💽 Size: ${sizeKB}KB`);
  }
}

// Export singleton instance
export const tmdbCache = new TMDBCache();

// Auto cleanup on app start
tmdbCache.cleanup();