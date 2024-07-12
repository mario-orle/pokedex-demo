import { ref, Ref } from 'vue';
import { ListPokemon, Pokemon } from '@/models/pokemon';
import { Paginated } from '@/models/list';
import { useRequestor } from '@/shared/use-requestor';

interface UsePokemonRetriever {
  pokemons: Ref<Pokemon[]>;
  getByName(name: string): Promise<Pokemon>;
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
  const pokemons = ref<Pokemon[]>([]);
  const { addRequest, addPriorityRequest } = useRequestor();

  async function getByName(name: string): Promise<Pokemon> {
    return new Promise((res) => {
      addPriorityRequest<Pokemon>(
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
    addPriorityRequest<Paginated<ListPokemon>>(
      url,
      async (paginatedPokemons) => {
        paginatedPokemons.results.map((partialPokemon) =>
          pokemons.value.push({ name: partialPokemon.name }),
        );
        backgroundEnrichment();
        if (!paginatedPokemons.next) {
          return;
        }
        pokemonListRetriever(paginatedPokemons.next);
      },
    );
  }

  function backgroundEnrichment(): void {
    const batch = pokemons.value.filter(
      (pokemon) => !pokemon.requested && !pokemon.id,
    );
    batch.forEach((pokemon) => {
      pokemon.requested = true;
      addRequest<Pokemon>(
        `${apiBaseUrl}/pokemon/${pokemon.name}`,
        enrichPokemon,
      );
    });
  }

  function enrichPokemon(pokemonResponse: Pokemon) {
    const idx = pokemons.value.findIndex(
      (p) => p.name === pokemonResponse.name,
    );
    pokemons.value[idx] = {
      ...pokemons.value[idx],
      ...pokemonResponse,
      requested: true,
    };
  }

  pokemonListRetriever();

  return { pokemons, getByName };
}
