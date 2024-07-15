import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCache } from '.';

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
  it('should be able to cache arbitrary strings indexing with a string', () => {
    const { save, restore } = useCache();
    expect(restore('not-existing')).toBeNull();

    save('test', 'value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test', '"value"');
  });

  it('should load stored data on instantiation', async () => {
    localStorageMock.getItem.mockImplementationOnce(() =>
      JSON.stringify('value'),
    );
    const { restore } = useCache();
    expect(restore('cached')).toBe('value');
  });
});
