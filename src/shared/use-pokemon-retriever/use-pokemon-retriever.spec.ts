import { describe, expect, it, vi } from 'vitest';
import { usePokemonRetriever } from '.';

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
    addPriorityRequest.mockImplementationOnce(
      (url: string, callback: (data: any) => void) => {
        callback({ next: 'nextUrl', results: [{ name: 'pikachu' }] });
      },
    );
    const { pokemons } = usePokemonRetriever();
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=20',
      expect.any(Function),
    );
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'nextUrl',
      expect.any(Function),
    );
    expect(addRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
      expect.any(Function),
    );
    expect(pokemons.value).toStrictEqual([
      { name: 'pikachu', requested: true },
    ]);
  });

  it('should retrieve a pokemon by name', async () => {
    addPriorityRequest.mockImplementationOnce(
      (url: string, callback: (data: any) => void) => {
        callback({ name: 'pikachu', id: 25 });
      },
    );
    const { getByName, pokemons } = usePokemonRetriever();
    getByName('pikachu');
    expect(addPriorityRequest).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
      expect.any(Function),
    );
    expect(pokemons.value).toStrictEqual([
      { name: 'pikachu', requested: true, id: 25 },
    ]);
  });
});
