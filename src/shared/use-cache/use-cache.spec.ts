import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCache } from '.';
import { flushPromises } from '@vue/test-utils';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('testing use-cache', () => {
  beforeEach(() => {
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
  });
  it('should be able to cache arbitrary strings indexing with a string', async () => {
    const { save, restore } = await useCache();
    expect(restore('not-existing')).toBeNull();

    save('test', 'value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test', '"value"');
  });

  it('should uncompress and load stored data on instantiation', async () => {
    localStorageMock.getItem.mockImplementationOnce(() =>
      JSON.stringify('value'),
    );
    const { restore } = await useCache();
    await flushPromises();
    expect(restore('cached')).toBe('value');
  });
});
