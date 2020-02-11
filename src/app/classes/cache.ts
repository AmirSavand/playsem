/**
 * Simple cache system to load initial data instantly from storage
 *
 * @example const myCache = new Cache<Party>({name: 'Party'});
 *          myCache.data = myData;
 *          myCache.data // myData
 */
export class Cache<T> {

  /**
   * Prefix for all cache storage keys
   */
  private static readonly STORAGE_KEY_PREFIX = 'cache-';

  public constructor(public name: string) {
  }

  /**
   * Clear all caches from storage
   * @returns Number of caches removed
   */
  public static clear(): number {
    let count = 0;
    for (const key of Object.keys(localStorage)) {
      if (key.indexOf(Cache.STORAGE_KEY_PREFIX) === 0) {
        localStorage.removeItem(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get storage key of this cache (prefix + name)
   */
  private get storageKey(): string {
    return Cache.STORAGE_KEY_PREFIX + this.name;
  }

  /**
   * Save cache data to storage
   * @param data New cache data
   */
  public set data(data: T) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      Cache.clear();
    }
  }

  /**
   * @returns Cache data from storage
   */
  public get data(): T {
    if (this.isCached()) {
      return JSON.parse(localStorage.getItem(this.storageKey));
    }
  }

  /**
   * @returns Whether cache is stored or not
   */
  public isCached(): boolean {
    return Boolean(localStorage.getItem(this.storageKey));
  }

  /**
   * Clear all cache data from storage
   */
  public clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
