import { useCache } from '@/shared/use-cache';

interface Request {
  url: string;
  callback: (data: any) => void;
}

interface UseRequestor {
  addRequest<T>(url: string, callback: (data: T) => void): void;
  addPriorityRequest<T>(url: string, callback: (data: T) => void): void;
}

const MAX_CONCURRENT_REQUESTS = 4;

let instance: UseRequestor;

export function useRequestor(): UseRequestor {
  if (!instance) {
    instance = setup();
  }
  return instance;
}

function setup(): UseRequestor {
  const requests: Request[] = [];
  let working = false;

  function addRequest<T>(
    url: string,
    callback: (data: T) => void,
    prioritized = false,
  ): void {
    requests[prioritized ? 'unshift' : 'push']({ url, callback });
    if (!working) {
      batchRequestor();
    }
  }
  function addPriorityRequest<T>(
    url: string,
    callback: (data: T) => void,
  ): void {
    addRequest<T>(url, callback, true);
  }

  function batchRequestor() {
    working = true;
    const batchSize = Math.min(MAX_CONCURRENT_REQUESTS, requests.length);
    const batch = requests.splice(0, batchSize);
    Promise.all(
      batch.map((r) => cachedFetch(r.url).then((res) => r.callback(res))),
    ).then(() => {
      if (requests.length) {
        return batchRequestor();
      }
      working = false;
    });
  }

  async function cachedFetch<T>(url: string): Promise<T> {
    const { search, save } = await useCache();
    const cached = search(url);
    if (cached) {
      return JSON.parse(cached);
    }
    return fetch(url)
      .then((res) => res.text())
      .then((res) => {
        save(url, res);
        return JSON.parse(res);
      });
  }

  return { addRequest, addPriorityRequest };
}
