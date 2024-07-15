import { describe, expect, it, vi } from 'vitest';
import { usePokemonRetriever } from '.';

const save = vi.fn();
const restore = vi.fn();

vi.mock('@/shared/use-cache', () => ({
  useCache: () => ({
    save,
    restore,
  }),
}));

const addRequest = vi.fn();
const addPriorityRequest = vi.fn();

vi.mock('@/shared/use-requestor', () => ({
  useRequestor: () => ({
    addRequest,
    addPriorityRequest,
  }),
}));

describe('testing use-pokemon-retriever', () => {
  it('should start retrieving pokemon list when instantiated', async () => {
    addPriorityRequest.mockImplementation(
      (url: string, callback: (data: any) => void) => {
        callback({
          next: url === 'nextUrl' ? null : 'nextUrl',
          count: 2,
          results: [{ name: 'pikachu' }],
        });
      },
    );
    const { pokemonList } = usePokemonRetriever();
    // Should start retrieving data.
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=20',
      expect.any(Function),
    );
    // And continue until no more nextUrls.
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'nextUrl',
      expect.any(Function),
    );
    // And then will start to enrich retrieved pokemons.
    expect(addRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
      expect.any(Function),
    );
    expect(pokemonList.value).toStrictEqual([
      { name: 'pikachu', requested: true },
    ]);
  });

  it('should retrieve a pokemon by name', async () => {
    addPriorityRequest.mockImplementationOnce(
      (_: string, callback: (data: any) => void) => {
        callback({
          name: 'pikachu',
          id: 25,
          sprites: { front_default: 'test' },
        });
      },
    );
    const { getByName, pokemonList } = usePokemonRetriever();
    getByName('pikachu');
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
      expect.any(Function),
    );
    expect(pokemonList.value).toStrictEqual([
      {
        name: 'pikachu',
        requested: true,
        id: 25,
        image: 'test',
        types: undefined,
        moves: undefined,
      },
    ]);
  });
});
