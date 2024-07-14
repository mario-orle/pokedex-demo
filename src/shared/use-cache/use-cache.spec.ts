/*import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCache } from '.';
import { flushPromises } from '@vue/test-utils';

vi.mock('smol-string/worker', () => ({
  compress: vi.fn(),
  decompress: vi.fn().mockResolvedValue('{"cached":"value"}'),
}));

const localStorageMock = {
  getItem: vi.fn().mockReturnValue({}),
  setItem: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('testing use-cache', () => {
  beforeEach(() => {
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
  });
  it('should be able to cache arbitrary strings indexing with a string', async () => {
    const { save, search } = await useCache();
    expect(search('test')).toBeUndefined();

    save('test', 'value');
    expect(search('testa')).toBe('value');
  });

  it('should uncompress and load stored data on instantiation', async () => {
    const { search } = await useCache();
    await flushPromises();
    expect(search('cached')).toBe('value');
  });

  it('should persist cached data after 10 saves', async () => {
    const { save } = await useCache();
    for (let i = 0; i < 10; i++) {
      save(`test${i}`, 'data');
    }
    await flushPromises();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
*/
