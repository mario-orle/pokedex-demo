import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRequestor } from '.';
import { flushPromises } from '@vue/test-utils';

let response = '{}';

const slowPromise = (resolveValue = '') =>
  new Promise<string>((res) => setTimeout(() => res(resolveValue), 10));
const awaiter = (delay = 11) =>
  new Promise<void>((res) => setTimeout(() => res(), delay));
const fetchMock = vi.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(response) }),
);
vi.stubGlobal('fetch', fetchMock);

vi.mock('@/shared/use-cache', () => ({
  useCache: () => ({
    search: vi.fn(),
    save: vi.fn(),
  }),
}));

describe('testing use-requestor', () => {
  const callback = vi.fn();
  beforeEach(() => {
    callback.mockClear();
    fetchMock.mockClear();
  });
  it('should make regular requests', async () => {
    const { addRequest } = useRequestor();
    addRequest('url', callback);
    await flushPromises();
    expect(callback).toHaveBeenCalledWith('{}');
    expect(fetchMock).toHaveBeenCalledWith('url');
  });

  it('should make prioritary requests', async () => {
    const { addRequest, addPriorityRequest } = useRequestor();
    // a first request is needed, as the first one will be launched automatically.
    addRequest('first', callback);
    addRequest('url', callback);
    addPriorityRequest('prioritary', callback);
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'first');
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'prioritary');
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'url');
  });
  it('should make a max of 4 concurrent request', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({ json: () => slowPromise(response) }),
    );
    const { addRequest } = useRequestor();
    addRequest('url', callback);
    addRequest('url', callback);
    addRequest('url', callback);
    addRequest('url', callback);
    addRequest('url', callback);
    addRequest('url', callback);

    // the first request always will be performed automatically.
    await awaiter();
    expect(callback).toHaveBeenCalledTimes(1);

    // then, the following 4 will be performed.
    callback.mockClear();
    await awaiter();
    expect(callback).toHaveBeenCalledTimes(4);

    // and the last one.
    callback.mockClear();
    await awaiter();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
