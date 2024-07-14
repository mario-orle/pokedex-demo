import { ref, Ref } from 'vue';
import { ListPokemonApi, ListPokemonView, PokemonApi } from '@/models/pokemon';
import { Paginated } from '@/models/list';
import { useRequestor } from '@/shared/use-requestor';
import { useCache } from '../use-cache';

interface UsePokemonRetriever {
  pokemonList: Ref<ListPokemonView[]>;
  getByName(name: string): Promise<PokemonApi>;
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

  async function getByName(name: string): Promise<PokemonApi> {
    return new Promise((res) => {
      addPriorityRequest<PokemonApi>(
        `${apiBaseUrl}/pokemon/${name}`,
        (pokemonResponse) => {
          enrichPokemon(pokemonResponse);
          res(pokemonResponse);
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
        paginatedPokemons.results.map((partialPokemon) =>
          pokemonList.value.push({
            name: partialPokemon.name,
            requested: false,
          }),
        );
        backgroundEnrichment();
        if (!paginatedPokemons.next) {
          useCache().save('pokemon-list-view', pokemonList.value);
          return;
        }
        pokemonListRetriever(paginatedPokemons.next);
      },
    );
  }

  function backgroundEnrichment(): void {
    const batch = pokemonList.value.filter(
      (pokemon) => !pokemon.requested && !pokemon.id,
    );
    batch.forEach((pokemon) => {
      pokemon.requested = true;
      addRequest<PokemonApi>(
        `${apiBaseUrl}/pokemon/${pokemon.name}`,
        enrichPokemon,
      );
    });
  }

  function enrichPokemon(pokemonResponse: PokemonApi) {
    const pokemon = pokemonList.value.find(
      (p) => p.name === pokemonResponse.name,
    );
    if (!pokemon) {
      return;
    }

    pokemon.id = pokemonResponse.id;
    pokemon.image = pokemonResponse.sprites?.front_default;
    pokemon.types = pokemonResponse.types?.map((t) => t.type.name);
    pokemon.requested = true;

    useCache().save('pokemon-list-view', pokemonList.value);
  }

  if (
    !(
      pokemonList.value.length > 100 &&
      !pokemonList.value.find((p) => !p.requested || !p.id)
    )
  ) {
    pokemonListRetriever();
  }

  return { pokemonList, getByName };
}
