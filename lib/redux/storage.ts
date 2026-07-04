import localforage from "localforage";
import type { Storage as PersistStorage } from "redux-persist";

/**
 * redux-persist storage engine backed by IndexedDB (via localforage)
 * instead of localStorage. Used for data that can grow large and that
 * should remain available offline (trips, the offline sync queue) —
 * localStorage's ~5MB synchronous API is a poor fit for that, while
 * IndexedDB is asynchronous and has a much higher practical limit.
 *
 * Falls back to a no-op storage during server-side rendering, where
 * `indexedDB` does not exist.
 */
export function createIndexedDbStorage(storeName: string): PersistStorage {
  if (typeof window === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => undefined,
      removeItem: async () => undefined,
    };
  }

  const instance = localforage.createInstance({
    name: "voyago",
    storeName,
  });

  return {
    getItem: (key: string) => instance.getItem<string>(key),
    setItem: (key: string, value: string) => instance.setItem(key, value),
    removeItem: (key: string) => instance.removeItem(key),
  };
}
