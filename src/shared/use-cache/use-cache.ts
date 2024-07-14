interface UseCache {
  restore<T>(key: string): T | null;
  save(key: string, value: unknown): void;
}

let instance: UseCache;

export function useCache(): UseCache {
  if (!instance) {
    instance = setup();
  }
  return instance;
}

function setup(): UseCache {
  function save(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function restore(key: string) {
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  }

  return { save, restore };
}
