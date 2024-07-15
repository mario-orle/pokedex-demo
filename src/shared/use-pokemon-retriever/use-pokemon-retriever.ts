import { ref, Ref } from 'vue';
import { ListPokemonApi, ListPokemonView, PokemonApi } from '@/models/pokemon';
import { Paginated } from '@/models/list';
import { useRequestor } from '@/shared/use-requestor';
import { useCache } from '../use-cache';

interface UsePokemonRetriever {
  pokemonList: Ref<ListPokemonView[]>;
  getByName(name: string): Promise<ListPokemonView>;
}
const apiBaseUrl = 'https://pokeapi.co/api/v2';
const defaultPageSize = 20;
let instance: UsePokemonRetriever;

export function usePokemonRetriever(): UsePokemonRetriever {
  if (!instance) {
    instance = setup();
  }
  return instance;
}

function setup(): UsePokemonRetriever {
  const pokemonList = ref<ListPokemonView[]>(
    useCache().restore('pokemon-list-view') ?? [],
  );
  const { addRequest, addPriorityRequest } = useRequestor();

  async function getByName(name: string): Promise<ListPokemonView> {
    return new Promise((res) => {
      const storedPokemon = pokemonList.value.find(
        (p) => p.name === name && p.id,
      );
      if (storedPokemon) {
        res(storedPokemon);
        return;
      }
      addPriorityRequest<PokemonApi>(
        `${apiBaseUrl}/pokemon/${name}`,
        (pokemonResponse) => {
          const storedPokemon = enrichPokemon(pokemonResponse);
          res(storedPokemon!);
        },
      );
    });
  }

  function pokemonListRetriever(
    url = `${apiBaseUrl}/pokemon?limit=${defaultPageSize}`,
  ): void {
    addPriorityRequest<Paginated<ListPokemonApi>>(
      url,
      async (paginatedPokemons) => {
        // if we have full list, we dont start again retrieving list and will go to enrichment.
        if (pokemonList.value.length === paginatedPokemons.count) {
          backgroundEnrichment();
          return;
        }
        paginatedPokemons.results.map(
          (partialPokemon) =>
            !pokemonList.value.find((p) => p.name === partialPokemon.name) &&
            pokemonList.value.push({
              name: partialPokemon.name,
              requested: false,
            }),
        );
        if (!paginatedPokemons.next) {
          useCache().save('pokemon-list-view', pokemonList.value);
          backgroundEnrichment();
          return;
        }
        pokemonListRetriever(paginatedPokemons.next);
      },
    );
  }

  function backgroundEnrichment(): void {
    const batch = pokemonList.value.filter((pokemon) => !pokemon.id);
    batch.forEach((pokemon) => {
      pokemon.requested = true;
      addRequest<PokemonApi>(
        `${apiBaseUrl}/pokemon/${pokemon.name}`,
        enrichPokemon,
      );
    });
  }

  function enrichPokemon(
    pokemonResponse: PokemonApi,
  ): ListPokemonView | undefined {
    const pokemon = pokemonList.value.find(
      (p) => p.name === pokemonResponse.name,
    );
    if (!pokemon) {
      return;
    }

    pokemon.id = pokemonResponse.id;
    pokemon.image = pokemonResponse.sprites?.front_default;
    pokemon.types = pokemonResponse.types?.map((t) => t.type.name);
    pokemon.moves = pokemonResponse.moves?.map((m) => m.move.name);
    pokemon.requested = true;

    useCache().save('pokemon-list-view', pokemonList.value);
    return pokemon;
  }

  pokemonListRetriever();

  return { pokemonList, getByName };
}
