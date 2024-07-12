import { compress, decompress } from 'smol-string/worker';
import { ref, watch } from 'vue';

interface CachedResource {
  [key: string]: string;
}

interface UseCache {
  search(key: string): string | null;
  save(key: string, value: string): void;
}

const STORE_AFTER_SAVE_TIMES = 10;
const storageKey = 'compressed-pokemon-cache';

let instance: UseCache;

export async function useCache(): Promise<UseCache> {
  if (!instance) {
    instance = await setup();
  }
  return instance;
}

async function setup(): Promise<UseCache> {
  let cache: CachedResource = await restoreCache();
  const persisting = ref(false);

  async function restoreCache(): Promise<CachedResource> {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(await decompress(stored)) as CachedResource;
    }
    return {};
  }
  let requestSinceLastStorage = 0;
  function save(key: string, value: string) {
    cache[key] = value;
    requestSinceLastStorage++;
    if (
      requestSinceLastStorage >= STORE_AFTER_SAVE_TIMES &&
      persisting.value === false
    ) {
      persisting.value = true;
      persist().then(() => {
        persisting.value = false;
        requestSinceLastStorage = 0;
      });
    }
  }

  async function persist() {
    localStorage.setItem(storageKey, await compress(JSON.stringify(cache)));
  }

  function search(key: string) {
    return cache[key];
  }

  return { save, search };
}
