const memoryStore = new Map<string, string>();

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function createMemoryStorage(): StorageLike {
  return {
    getItem(key) {
      return memoryStore.get(key) ?? null;
    },
    setItem(key, value) {
      memoryStore.set(key, value);
    },
  };
}

export function getBrowserStorage(): StorageLike {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createMemoryStorage();
  }

  return window.localStorage;
}

export function readCollection<T>(key: string, fallback: T): T {
  const storage = getBrowserStorage();
  const value = storage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeCollection<T>(key: string, value: T): void {
  const storage = getBrowserStorage();
  storage.setItem(key, JSON.stringify(value));
}

