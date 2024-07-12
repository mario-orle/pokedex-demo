import { compress, decompress } from 'smol-string/worker';

interface CachedResource {
  [key: string]: string;
}

interface UseCache {
  search(key: string): string | null;
  save(key: string, value: string): void;
}

const STORE_AFTER_SAVE_TIMES = 10;

let instance: UseCache;

export async function useCache(): Promise<UseCache> {
  if (!instance) {
    instance = await setup();
  }
  return instance;
}

const storageKey = 'compressed-pokemon-cache';

async function setup(): Promise<UseCache> {
  let cache: CachedResource = await restoreCache();
  let persisting = false;

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
    if (requestSinceLastStorage > STORE_AFTER_SAVE_TIMES && !persisting) {
      persisting = true;
      persist().then(() => {
        persisting = false;
        requestSinceLastStorage = 0;
      });
    }
  }

  async function persist() {
    console.log('storing ' + Object.keys(cache).length);
    localStorage.setItem(storageKey, await compress(JSON.stringify(cache)));
    console.log('stored');
  }

  function search(key: string) {
    return cache[key];
  }

  return { save, search };
}
